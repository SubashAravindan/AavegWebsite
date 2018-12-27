const passport = require('passport')
const Admin = require('../models/Admin.js')
const accessList = require('../../config/adminAccess.js')
const logger = require('../../config/winston.js')
const Event = require('../models/Event.js')
const Venue = require('../models/Venue.js')
const venueController = require('./venueController.js')

exports.showLogin = (req, res) => {
  res.render('auth/admin/login')
}

exports.showRegister = (req, res) => {
  res.render('auth/admin/register')
}

exports.authenticate = passport.authenticate('local',
  {
    failureRedirect: '/login'
  })

exports.logout = (req, res) => {
  req.logout()
  res.redirect('/')
}

exports.logOutFromStudent = (req, res, next) => {
  if (req.session.stype === 'student') {
    req.session.rollnumber = null
    req.session.type = null
  }
  next()
}

exports.login = (req, res) => {
  req.session.type = 'admin'
  req.session.save()
  res.redirect('/')
}

exports.register = (req, res) => {
  const newAdmin = {
    username: req.body.username,
    permissions: accessList[req.body.username]
  }
  Admin.register(new Admin(newAdmin), req.body.password, (err, newAdmin) => {
    if (err) {
      logger.error(err.message)
      return res.redirect('/register')
    } else {
      passport.authenticate('local')(req, res, () => {
        res.redirect('/')
      })
    }
  })
}
// Check if the admin should be allowed to register
exports.checkAdminAccess = (req, res, next) => {
  if (Object.keys(accessList).includes(req.body.username)) {
    next()
  } else {
    logger.warn(`Access denied for ${req.body.username}`)
    res.redirect('/register') // Need to dsiplay a message saying access denied
  }
}

// Middleware for admin login check
exports.checkAdminLogin = (req, res, next) => {
  if (req.session.type === 'admin' && req.user.permissions.length) {
    return next()
  } else {
    res.redirect('/login')
  }
}

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

exports.showEventData = async (req, res) => {
  try {
    Event.find({}, 'name cluster cup points venue description rules date startTime endTime').populate('venue').exec()
    res.render('admin/events')
  } catch (err) {
    logger.error(err)
    res.status(500).send(err)
  }
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
    newEvent.places = req.body.places
    for (var i = 0; i < req.body.places; i++) { newEvent.points[i] = req.body.points[i] }
    await Venue.findOne({ name: req.body.venue }).then(doc => {
      newEvent.venue = doc['_id']
    })
    logger.info(`Event ${req.body.name} has been created`)
    newEvent.save().then(() => {
      Event.findOne({ id: newEvent._id }).populate('venue', { where: {
        name: req.body.venue
      } }).exec()
      res.redirect('admin/events')
    })
  } catch (err) {
    logger.error(err)
    res.status(500).send(err)
  }
}

exports.deleteEventData = async (req, res) => {
  try {
    await Event.findOneAndRemove({ id: req.params.id }).exec()
    logger.info(`Deleted event ${req.params.id}`)
  } catch (err) {
    logger.error(err)
    res.status(500).send(err)
  }
}

exports.editEventData = async (req, res) => {
  try {
    await Event.findById(req.params.id).then(doc => {
      doc.name = req.body.name
      doc.cluster = req.body.cluster
      doc.cup = req.body.cup
      doc.description = req.body.description
      doc.rules = req.body.rules
      doc.date = req.body.date
      doc.startTime = req.body.startTime
      doc.endTime = req.body.endTime
      for (var i = 0; i < req.body.places; i++) { doc.points[i] = req.body.points[i] }
      Venue.findOne({ name: req.body.venue }).then(d => {
        doc.venue = d['_id']
      })
      doc.save()
    })
    logger.info(`Edited event ${req.params.id}`)
    res.redirect('admin/events')
  } catch (err) {
    logger.error(err)
    res.status(500).send(err)
  }
}
