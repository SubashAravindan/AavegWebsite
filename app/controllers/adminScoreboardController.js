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
  const points = await Events.findById(req.query.data).exec()
  return res.status(200).send(points.points)
}

exports.createScore = async (req, res) => {
  let noOfPositions = []
  let noOfPoints = []
  let keys = Object.keys(req.body)
  keys.forEach(function (item) {
    if (item.indexOf('position') !== -1) {
      noOfPositions.push(req.body[item])
    }
    if (item.indexOf('points') !== -1) { noOfPoints.push(req.body[item]) }
  })

  for (let j = 0; j < noOfPositions.length; j++) {
    let hostelList = noOfPositions[j]
    let points = noOfPoints[j]

    for (let i = 0; i < hostelList.length; i++) {
      let Pos = new Score({
        hostel: hostelList[i],
        event: req.body.eventId,
        position: (j + 1),
        points: points
      })
      try {
        await Pos.save()
        logger.info(`Scores added by ${req.session.rollnumber}`)
      } catch (error) {
        logger.error(error)
        return res.status(500).send(error)
      }
    }
  }
  res.redirect('/admin')
}
