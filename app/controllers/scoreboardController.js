const logger = require('../../config/winston.js')
const Score = require('../models/Score.js')
const Events = require('../models/Event.js')
const hostelController = require('../controllers/hostelController.js')

var showScoreboard = async (req, res) => {
  try {
    const hostelList = await hostelController.getHostels()
    logger.log('debug', hostelList)
    const scoreData = await Score.find({}).exec()
    const eventList = await getEventList()
    logger.log('debug', eventList)
    return res.send({ 'scoreData': scoreData, 'hostelList': hostelList, 'eventList': eventList, 'totals': getTotalByHostel(hostelList, scoreData) })
  } catch (error) {
    return res.status(500).send(error)
  }
}

async function getEventList () {
  const eventInfo = await Events.find({}).exec()
  return { 'id': eventInfo._id,
    'name': eventInfo.name }
}

function getCupByEventId (id) {
  const eventInfo = Events.findById(id).exec()
  return (eventInfo.cup)
}

function getTotalByHostel (hostelList, scoreData) {
  var total = Array(hostelList.length).fill(0)
  for (var j = 0; j < hostelList.length; j++) {
    for (var i = 0; i < scoreData.length; i++) {
      if (scoreData[i].hostel === hostelList[j]._id) {
        total[j] = total[j] + scoreData[i].points
      }
    }
  }
}

var getScoreByCup = async (req, res) => {
  try {
    const hostelList = await hostelController.getHostels()
    var cupScore = []
    var total = 0
    var cup = req.query.cup
    const scoreData = await Score.find({}).exec()
    for (var i = 0; i < scoreData.length; i++) {
      if (cup === getCupByEventId(scoreData.event)) {
        cupScore.push(scoreData[i])
        total = total + scoreData[i]
      }
    }
    return res.send({ 'cupScore': cupScore, 'hostelList': hostelList, 'total': total, 'eventList': await getEventList() })
  } catch (error) {
    return res.status(500).send(error)
  }
}

module.exports = {
  getScoreByCup: getScoreByCup,
  showScoreboard: showScoreboard
}
