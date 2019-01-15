const logger = require('../../config/winston.js')
const Event = require('../models/Event.js')
const Cup = require('../models/Cup.js')
const Cluster = require('../models/Cluster.js')
const venueController = require('./venueController.js')
const { check, validationResult } = require('express-validator/check')
const moment = require('moment')
/* Returns venue data, cluster names, cup names all at once for simplification */
async function getVenueClusterCup () {
  let venue = venueController.getVenues()
  let clusterData = Cluster.find({}).exec()
  let cupData = Cup.find({}).exec()
  const [venueData, clusterNames, cupNames] = await Promise.all([venue, clusterData, cupData])
  return {
    venueData,
    clusterNames: clusterNames.map(a => a.name),
    cupNames: cupNames.map(a => a.name)
  }
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
      if (!Number(points[0])) {
        throw new Error('Enter points to be allotted to at least 1 winner')
      } else {
        return true
      }
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
    .trim().isLength({ min: 1, max: 1000 }).withMessage('Your description is either blank or too long'),
  check('rules')
    .trim().not().isEmpty().withMessage('Rules is missing'),
  check('startTime')
    .not().isEmpty().withMessage('Start time is missing'),
  check('endTime')
    .not().isEmpty().withMessage('End time is missing')
    .custom((endTime, { req }) => {
      if (endTime > req.body.startTime || !req.body.startTime) {
        return true
      } else {
        throw new Error('End time should be greater than start time, unless you have a time machine ;p')
      }
    })
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
    eventToEdit.startTime = moment(eventToEdit.startTime).format('YYYY-MM-DDTHH:mm')
    eventToEdit.endTime = moment(eventToEdit.endTime).format('YYYY-MM-DDTHH:mm')
    Object.assign(eventToEdit, {
      rollno: req.session.rollnumber,
      venues: venueData,
      clusters: clusterNames,
      cups: cupNames,
      eventName: eventToEdit.name
    })
    res.render('auth/admin/eventEdit', {
      data: eventToEdit,
      title: 'Event Edit'
    })
  } catch (err) {
    res.status(500).send(err)
    logger.error(err)
  }
}

exports.saveEventData = async (req, res) => {
  const errors = validationResult(req).array()
  const errorMessages = errors.map(error => error.msg)
  logger.error({ user: req.session.passport.user, errors: errorMessages })
  if (errors.length) {
    res.status(422).send(errorMessages)
  } else {
    try {
      const { name, cluster, cup, description, rules, date, startTime, endTime, points, venue, places } = req.body
      const newEvent = await Event.create({
        name,
        cluster,
        cup,
        description,
        rules,
        date,
        startTime,
        endTime,
        points,
        venue,
        places
      })
      logger.info(`Event ${newEvent.name} has been created by ${req.session.passport.user}`)
      res.sendStatus(200)
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
    res.redirect('events')
  } catch (err) {
    logger.error(err)
    res.status(500).send(err)
  }
}

exports.editEventData = async (req, res) => {
  const errors = validationResult(req).array()
  const errorMessages = errors.map(error => error.msg)
  logger.error({ user: req.session.passport.user, errors: errorMessages })
  if (errors.length) {
    res.status(422).send(errorMessages)
  } else {
    try {
      const eventToEdit = await Event.findById(req.params.id)
      const {
        name, cluster, cup, description, rules, venue, date, startTime, endTime, places, points
      } = req.body
      Object.assign(eventToEdit, {
        name,
        cluster,
        cup,
        description,
        rules,
        venue,
        date,
        startTime,
        endTime,
        places,
        points
      })
      try {
        await eventToEdit.save()
        logger.info(`Event ${req.params.id} edited by ${req.session.passport.user}`)
        res.sendStatus(200)
      } catch (error) {
        res.status(500).send(error)
      }
    } catch (err) {
      logger.error(err)
      res.status(500).send(err)
    }
  }
}
