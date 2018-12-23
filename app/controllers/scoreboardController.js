const logger = require('../../config/winston.js')
const Score = require('../models/Score.js')

var showScoreboard = async (req, res) => {
  try {
    Score.aggregate([
      { $lookup: { from: 'events',
        localField: 'event',
        foreignField: '_id',
        as: 'event' } },
      { $lookup: { from: 'hostels',
        localField: 'hostel',
        foreignField: '_id',
        as: 'hostel' } },
      { $group: { _id: { 'cup': '$event.cup', 'hostel': '$hostel.name', 'position': '$position' }, details: { $push: { event_id: '$event._id', event_name: '$event.name', points: '$points', 'date': '$event.date' } } } },
      { $sort: { 'event.date': -1 } }],
    function (err, scoreData) {
      if (err) logger.log('error', err)
      return res.send({ 'scoreData': scoreData, 'totals': getTotalByHostel() })
    })
  } catch (error) {
    return res.status(500).send(error)
  }
}

function getTotalByHostel () {
  Score.aggregate([
    { $lookup: { from: 'events',
      localField: 'event',
      foreignField: '_id',
      as: 'event' } },
    { $lookup: { from: 'hostels',
      localField: 'hostel',
      foreignField: '_id',
      as: 'hostel' } },
    { $group: { '_id': { 'cup': '$event.cup', 'hostel': '$hostel.name' }, 'hostel_total_points': { $sum: '$points' } } }],
  function (err, totals) {
    if (err) logger.log('error', err)
    return totals
  }
  )
}

module.exports = {
  showScoreboard: showScoreboard
}
