const logger = require('../../config/winston.js')
const Events = require('../models/Event.js')
const Hostels = require('../models/Hostel.js')
const Score = require('../models/Score.js')

exports.showScoreForm = async (req, res) => {
  const hostels = await Hostels.find({}).exec()
  logger.log('debug', hostels)
  const eventList = await Events.find({}).exec()
  logger.log('debug', eventList)
  res.render('auth/admin/addScore', { 'eventList': eventList, 'hostels': hostels, 'title': 'Add Score' })
}

exports.createScore = (req, res) => {
  logger.log('debug', req.body.first)

  for (let i = 0; i < req.bodyfirst.length; i++) {
    var firstPos = new Score({
      hostel: req.body.first[i],
      event: req.body.eventId,
      position: 1,
      points: req.body.firstPoints
    })
    firstPos.save(function (error) {
      logger.log('debug', 'success')
      if (error) { return res.status(500).send(error) }
    })
  }

  for (let i = 0; i < req.body.second.length; i++) {
    var secondPos = new Score({
      hostel: req.body.second[i],
      event: req.body.eventId,
      position: 2,
      points: req.body.secondPoints
    })

    secondPos.save(function (error) {
      logger.log('debug', 'success')
      if (error) { return res.status(500).send(error) }
    })
  }

  for (let i = 0; i < req.body.third.length; i++) {
    var thirdPos = new Score({
      hostel: req.body.third[i],
      event: req.body.eventId,
      position: 3,
      points: req.body.thirdPoints
    })

    thirdPos.save(function (error) {
      logger.log('debug', 'success')
      if (error) { return res.status(500).send(error) }
    })
  }

  return res.status(200)
}
