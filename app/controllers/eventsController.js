const mongoose = require('mongoose')
const logger = require('../../config/winston.js')
const Event = require('../models/Event.js')
const Cup = require('../models/Cup.js')
const Cluster = require('../models/Cluster.js')
const venueController = require('./venueController.js')
const { check, validationResult } = require('express-validator/check')
const moment = require('moment')
const scoreboardController = require('../controllers/scoreboardController')

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
    res.render('events/eventAdd', {
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
    res.status(500).render('error', { title: 'Error', error: 'Internal server error' })
  }
}

exports.editEventForm = async (req, res) => {
  try {
    const { venueData, clusterNames, cupNames } = await getVenueClusterCup()
    const eventToEdit = await Event.findById(req.params.id)
    Object.assign(eventToEdit, {
      rollno: req.session.rollnumber,
      venues: venueData,
      clusters: clusterNames,
      cups: cupNames,
      eventName: eventToEdit.name
    })
    res.render('events/eventEdit', {
      data: eventToEdit,
      moment: moment,
      title: 'Event Edit'
    })
  } catch (err) {
    res.status(500).render('error', { title: 'Error', error: 'Internal server error' })
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
      res.status(500).render('error', { title: 'Error', error: 'Internal server error' })
    }
  }
}

exports.deleteEventData = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id).exec()
    logger.info(`Event ${req.params.id} deleted by ${req.session.passport.user}`)
    res.sendStatus(200)
  } catch (err) {
    logger.error(err)
    res.status(500).render('error', { title: 'Error', error: 'Internal server error' })
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
        res.status(500).render('error', { title: 'Error', error: 'Internal server error' })
      }
    } catch (err) {
      logger.error(err)
      res.status(500).render('error', { title: 'Error', error: 'Internal server error' })
    }
  }
}

exports.getEvents = async (req, res) => {
  try {
    const eventsData = await Event.find({}).populate('venue').exec()
    return res.send(eventsData)
  } catch (e) {
    logger.error(e)
    return res.status(500).render('error', { title: 'Error', error: 'Internal server error' })
  }
}

exports.getEventData = async (req, res) => {
  try {
    const eventData = await Event.find({ _id: req.params.id }).exec()
    return res.json(eventData)
  } catch (e) {
    logger.error(e)
    return res.status(500).render('error', { title: 'Error', error: 'Internal server error' })
  }
}

exports.showEventsPage = async (req, res) => {
  try {
    const eventsByCluster = await Event.aggregate([
      {
        $group: {
          '_id': '$cluster',
          'events': { $push: '$$ROOT' }
        }
      }
    ])
    res.render('events/eventsPage', { title: 'Events', eventsData: eventsByCluster })
  } catch (e) {
    res.status(500).render('error', { title: 'Error', error: 'Internal server error' })
  }
}

exports.showEvent = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.render('error', { title: 'Error', error: 'No such event' })
    }
    const eventData = await Event.findById(req.params.id).populate('venue').exec()
    if (eventData) {
      const startTime = new Date(Date.parse(eventData.startTime)).toDateString()
      const endTime = new Date(Date.parse(eventData.endTime)).toDateString()
      const winners = await scoreboardController.getEventScores(req.params.id)
      return res.render('events/showEvent', { title: eventData.name, eventData, startTime, endTime, winners })
    } else {
      return res.render('error', { title: 'Error', error: 'No such event' })
    }
  } catch (e) {
    return res.status(500).render('error', { title: 'Error', error: 'Internal server error' })
  }
}
