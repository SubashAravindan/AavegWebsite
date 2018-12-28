const logger = require('../../config/winston.js')
const Event = require('../models/Event.js')
const Venue = require('../models/Venue.js')
const venueController = require('./venueController.js')

exports.createEventForm = async (req, res) => {
  const venueData = await venueController.getVenues()
  const venueNames = venueData.map(venue => venue.name)
  res.render('auth/admin/eventAdd', {
    data: {
      rollno: req.session.rollnumber,
      venues: venueNames
    },
    title: 'Event Create'
  })
}

exports.editEventForm = async (req, res) => {
  const venueData = await venueController.getVenues()
  const venueNames = venueData.map(venue => venue.name)
  const EventtoEdit = await Event.findById(req.params.id)
  res.render('auth/admin/eventEdit', {
    data: {
      rollno: req.session.rollnumber,
      venues: venueNames,
      _id: EventtoEdit._id,
      eventName: EventtoEdit.name,
      cluster: EventtoEdit.cluster,
      cup: EventtoEdit.cup,
      description: EventtoEdit.description,
      rules: EventtoEdit.rules,
      date: EventtoEdit.date,
      startTime: EventtoEdit.startTime,
      endTime: EventtoEdit.endTime,
      places: EventtoEdit.places,
      points: EventtoEdit.points
    },
    title: 'Event Edit'
  })
}

exports.saveEventData = async (req, res) => {
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
    for (let i = 0; i < req.body.places; i++) { newEvent.points[i] = req.body.points[i] }
    await Venue.findOne({ name: req.body.venue }).then(doc => {
      newEvent.venue = doc['_id']
    })
    newEvent.places = req.body.places
    newEvent.save().then(() => {
      logger.info(`Event ${req.body.name} has been created by ${req.session.rollno}`)
      res.redirect('admin/events')
    })
  } catch (err) {
    logger.error(err)
    res.status(500).send(err)
  }
}

exports.deleteEventData = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id).exec()
    logger.info(`Event ${req.params.id} deleted by ${req.session.rollno}`)
  } catch (err) {
    logger.error(err)
    res.status(500).send(err)
  }
}

exports.editEventData = async (req, res) => {
  try {
    const EventtoEdit = await Event.findById(req.params.id)
    EventtoEdit.name = req.body.name
    EventtoEdit.cluster = req.body.cluster
    EventtoEdit.cup = req.body.cup
    EventtoEdit.description = req.body.description
    EventtoEdit.rules = req.body.rules
    EventtoEdit.date = req.body.date
    EventtoEdit.startTime = req.body.startTime
    EventtoEdit.endTime = req.body.endTime
    EventtoEdit.places = req.body.places
    for (let i = 0; i < req.body.places; i++) { EventtoEdit.points[i] = req.body.points[i] }
    await Venue.findOne({ name: req.body.venue }).then(doc => {
      EventtoEdit.venue = doc['_id']
    })
    EventtoEdit.save().then(() => {
      logger.info(`Event ${req.params.id} edited by ${req.session.rollno}`)
      res.redirect('admin/events')
    })
  } catch (err) {
    logger.error(err)
    res.status(500).send(err)
  }
}
