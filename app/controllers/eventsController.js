const logger = require('../../config/winston.js')
const Event = require('../models/Event.js')
const Cup = require('../models/Cup.js')
const Cluster = require('../models/Cluster.js')
const venueController = require('./venueController.js')
const config = require('../../config/config')
const { check, validationResult } = require('express-validator/check')

/* Returns venue data, cluster names, cup names all at once for simplification */
async function getVenueClusterCup () {
  const venueData = await venueController.getVenues()
  const clusterData = await Cluster.find({}).exec()
  const clusterNames = clusterData.map(cluster => cluster.name)
  const cupData = await Cup.find({}).exec()
  const cupNames = cupData.map(cup => cup.name)
  return {
    venueData: venueData,
    clusterNames: clusterNames,
    cupNames: cupNames
  }
}

async function errorHandling (req, errors) {
  const errorMessages = errors.map(error => error.msg)
  logger.error({ user: req.session.passport.user, errors: errorMessages })
  const { venueData, clusterNames, cupNames } = await getVenueClusterCup()
  let data = req.body
  data.venues = venueData
  data.clusters = clusterNames
  data.cups = cupNames
  const result = {
    data: data,
    error: errorMessages,
    title: 'Error page'
  }
  return result
}

exports.validate = [
  check('name')
    .trim().not().isEmpty().withMessage('Event name is missing'),
  check('cluster')
    .custom(async (cluster) => {
      const clusterNames = (await getVenueClusterCup()).clusterNames
      if (!clusterNames.includes(cluster)) {
        throw new Error('Select appropriate cluster')
      } else {
        return true
      }
    }),
  check('cup')
    .custom(async (cup) => {
      const cupNames = (await getVenueClusterCup()).cupNames
      if (!cupNames.includes(cup)) {
        throw new Error('Select appropriate cup')
      } else {
        return true
      }
    }),
  check('points')
    .custom(async (points) => {
      if (Number(points[0]) === 0 || Number(points[1]) === 0 || Number(points[2]) === 0) {
        throw new Error('Enter points to be allotted to at least 3 winners')
      } else { return true }
    }),
  check('venue')
    .exists().withMessage('Venue is missing')
    .custom(async (venue) => {
      const venueData = await venueController.getVenues()
      const venueIDs = venueData.map(v => v._id.toString())
      if (!venueIDs.includes(venue)) {
        throw new Error('Venue data incorrect')
      } else {
        return true
      }
    }),
  check('description')
    .trim().not().isEmpty().withMessage('Description is missing'),
  check('rules')
    .trim().not().isEmpty().withMessage('Rules is missing'),
  check('date')
    .not().isEmpty().withMessage('Date is missing'),
  check('startTime')
    .not().isEmpty().withMessage('Start time is missing'),
  check('endTime')
    .not().isEmpty().withMessage('End time is missing')
]

exports.createEventForm = async (req, res) => {
  try {
    const { venueData, clusterNames, cupNames } = await getVenueClusterCup()
    res.render('auth/admin/eventAdd', {
      data: {
        rollno: req.session.rollnumber,
        venues: venueData,
        clusters: clusterNames,
        cups: cupNames
      },
      title: 'Event Create'
    })
  } catch (err) {
    logger.error(err)
    res.status(500).send(err)
  }
}

exports.editEventForm = async (req, res) => {
  try {
    const { venueData, clusterNames, cupNames } = await getVenueClusterCup()
    const eventToEdit = await Event.findById(req.params.id)
    res.render('auth/admin/eventEdit', {
      data: {
        rollno: req.session.rollnumber,
        venues: venueData,
        venue: eventToEdit.venue,
        _id: eventToEdit._id,
        eventName: eventToEdit.name,
        clusters: clusterNames,
        cups: cupNames,
        cluster: eventToEdit.cluster,
        cup: eventToEdit.cup,
        description: eventToEdit.description,
        rules: eventToEdit.rules,
        date: eventToEdit.date,
        startTime: eventToEdit.startTime,
        endTime: eventToEdit.endTime,
        places: eventToEdit.places,
        points: eventToEdit.points
      },
      title: 'Event Edit'
    })
  } catch (err) {
    logger.error(err)
    res.status(500).send(err)
  }
}

exports.saveEventData = async (req, res) => {
  const errors = validationResult(req).array()
  if (errors.length) {
    res.render('auth/admin/eventAdd', await errorHandling(req, errors))
  } else {
    try {
      let newEvent = new Event()
      newEvent.name = req.body.name
      newEvent.cluster = req.body.cluster
      newEvent.cup = req.body.cup
      newEvent.description = req.body.description
      newEvent.rules = req.body.rules
      newEvent.date = req.body.date
      newEvent.startTime = req.body.startTime
      newEvent.endTime = req.body.endTime
      for (let i = 0; i < req.body.places; i++) { newEvent.points[i] = Number(req.body.points[i]) }
      newEvent.venue = req.body.venue
      newEvent.places = req.body.places
      newEvent.save().then(() => {
        logger.info(`Event ${req.body.name} has been created by ${req.session.passport.user}`)
        res.redirect(config.APP_BASE_URL + 'admin/events')
      })
    } catch (err) {
      logger.error(err)
      res.status(500).send(err)
    }
  }
}

exports.deleteEventData = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id).exec()
    logger.info(`Event ${req.params.id} deleted by ${req.session.passport.user}`)
  } catch (err) {
    logger.error(err)
    res.status(500).send(err)
  }
}

exports.editEventData = async (req, res) => {
  const errors = validationResult(req).array()
  if (errors.length) {
    res.render('auth/admin/eventEdit', await errorHandling(req, errors))
  } else {
    try {
      const eventToEdit = await Event.findById(req.params.id)
      eventToEdit.name = req.body.name
      eventToEdit.cluster = req.body.cluster
      eventToEdit.cup = req.body.cup
      eventToEdit.description = req.body.description
      eventToEdit.rules = req.body.rules
      eventToEdit.date = req.body.date
      eventToEdit.startTime = req.body.startTime
      eventToEdit.endTime = req.body.endTime
      eventToEdit.places = req.body.places
      for (let i = 0; i < req.body.places; i++) { eventToEdit.points[i] = Number(req.body.points[i]) }
      eventToEdit.markModified('points')
      eventToEdit.venue = req.body.venue
      eventToEdit.save().then(() => {
        logger.info(`Event ${req.params.id} edited by ${req.session.passport.user}`)
        res.redirect(config.APP_BASE_URL + 'admin/events')
      })
    } catch (err) {
      logger.error(err)
      res.status(500).send(err)
    }
  }
}
