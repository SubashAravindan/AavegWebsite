const logger = require('../../config/winston.js')
const Score = require('../models/Score.js')

var showScoreboard = async (req, res) => {
  try {
    const scoreData = await Score.aggregate([
      { $lookup: { from: 'events',
        localField: 'event',
        foreignField: '_id',
        as: 'event' } },
      { $lookup: { from: 'hostels',
        localField: 'hostel',
        foreignField: '_id',
        as: 'hostel' } },
      { $group: { _id: { 'cup': '$event.cup', 'hostel': '$hostel.name', 'position': '$position' }, details: { $push: { event_id: '$event._id', event_name: '$event.name', points: '$points', 'date': '$event.date' } } } },
      { $sort: { 'event.date': -1 } }]).exec()

    return res.send({ 'scoreData': scoreData, 'totals': await getTotalByHostel() })
  } catch (error) {
    return res.status(500).send(error)
  }
}

async function getTotalByHostel () {
  try {
    const totals = await Score.aggregate([
      { $lookup: { from: 'events',
        localField: 'event',
        foreignField: '_id',
        as: 'event' } },
      { $lookup: { from: 'hostels',
        localField: 'hostel',
        foreignField: '_id',
        as: 'hostel' } },
      { $group: { '_id': { 'cup': '$event.cup', 'hostel': '$hostel.name' }, 'hostel_total_points': { $sum: '$points' } } }])

    return totals
  } catch (error) {
    logger.error(error)
  }

}

var getEventScores = async function getEventScores (eventId) {
  const scoreData = await Score.find({ 'event': eventId }).exec()
  return scoreData

}


module.exports = {
  showScoreboard: showScoreboard,
  getEventScores: getEventScores
}
