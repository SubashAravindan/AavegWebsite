const logger = require('../../config/winston.js')
const Events = require('../models/Event.js')
const Hostels = require('../models/Hostel.js')
const Score = require('../models/Score.js')

exports.showScoreForm = async (req, res) => {
  const hostels = await Hostels.find({}).exec()
  const eventList = await Events.find({}).exec()
  res.render('auth/addScore', { 'eventList': eventList, 'hostels': hostels, 'title': 'Add Score' })
}

exports.getPoints = async (req, res) => {
  const points = await Events.findById(req.body.data).exec()
  return res.status(200).send(points.points)
}

exports.createScore = (req, res) => {
  let noOfPositions = []
  let noOfPoints = []
  let keys = Object.keys(req.body)
  logger.log('debug', 'keys' + keys)
  keys.forEach(function (item) {
    if (item.indexOf('position') !== -1) {
      noOfPositions.push(req.body[item])
      logger.log('debug', req.body[item])
    }
    if (item.indexOf('points') !== -1) { noOfPoints.push(req.body[item]) }
  })
  logger.log('debug', 'noOfPositions' + noOfPositions)
  logger.log('debug', 'noofPoints' + noOfPoints)

  for (let j = 0; j < noOfPositions.length; j++) {
    let hostelList = noOfPositions[j]
    logger.log('debug', hostelList)
    let points = noOfPoints[j]

    for (let i = 0; i < hostelList.length; i++) {
      var Pos = new Score({
        hostel: hostelList[i],
        event: req.body.eventId,
        position: (j + 1),
        points: points
      })
      logger.log('debug', 'here' + hostelList[i])

      Pos.save(function (error) {
        logger.log('debug', 'success')
        if (error) { return res.status(500).send(error) }
      })
    }
  }
  res.redirect('/admin')
}