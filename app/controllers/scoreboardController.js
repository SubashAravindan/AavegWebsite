const logger = require('../../config/winston.js')
const Score = require('../models/Score.js')

var showScoreboard = async (req, res) => {
  try {
    const scoreData = await Score.aggregate([
      {
        $lookup: {
          from: 'events',
          localField: 'event',
          foreignField: '_id',
          as: 'event'
        }
      },
      {
        $lookup: {
          from: 'hostels',
          localField: 'hostel',
          foreignField: '_id',
          as: 'hostel'
        }
      },
      { $group: { _id: { 'cup': '$event.cup', 'hostel': '$hostel.name', 'position': '$position' }, details: { $push: { event_id: '$event._id', event_name: '$event.name', points: '$points', 'date': '$event.date' } } } },
      { $sort: { 'event.date': -1 } }]).exec()

    const totalData = await getTotalByHostel();

    const culturalTotals = []
    const sportsTotals = []
    const spectrumTotals = []
    const total = {}
    const event_culturals = []
    const event_sports = []
    const event_spectrum = []
    const event_culturals_arr = []
    const event_sports_arr = []
    const event_spectrum_arr = []
    const recents = {}

    totalData.forEach((item) => {
      if (item._id.cup[0] == 'Culturals')
        culturalTotals.push(item)
      if (item._id.cup[0] == 'Sports')
        sportsTotals.push(item)
      if (item._id.cup[0] == 'Spectrum')
        spectrumTotals.push(item)

      let hostel = item._id.hostel[0]
      if (total[String(hostel)] != undefined)
        total[String(hostel)] += item.hostel_total_points
      else
        total[String(hostel)] = item.hostel_total_points
    })

    culturalTotals.map(pointsMapper)
    sportsTotals.map(pointsMapper)
    spectrumTotals.map(pointsMapper)

    scoreData.forEach((item) => {
      if (item._id.cup[0] == 'Culturals')
        event_culturals.push(item)
      if (item._id.cup[0] == 'Spectrum')
        event_spectrum.push(item)
      if (item._id.cup[0] == 'Sports')
        event_sports.push(item)

      let hostel = item._id.hostel[0]
      if (recents[String(hostel)] == undefined) {
        recents[String(hostel)] = []
      }

      if (recents[String(hostel)].length < 3) {
        const recent_obj = {
          event_name: item.details[0].event_name[0],
          position: item._id.position
        }

        recents[String(hostel)].push(recent_obj)
      }
    })

    event_culturals.forEach((item) => {
      let index = event_culturals_arr.find((ele) => {
        return ele.event_name == item.details[0].event_name[0]
      })
      hostel = item._id.hostel[0]
      if (index != -1) {
        event_culturals_arr[index][String(hostel)] = item.details[0].points
      } else {
        const event_obj = {
          event_name: item.details[0].event_name[0],
          [String(hostel)]: item.details[0].points
        }
        event_culturals_arr.push(event_obj)
      }
    })

    event_sports.forEach((item) => {
      let index = event_sports_arr.find((ele) => {
        return ele.event_name == item.details[0].event_name[0]
      })
      hostel = item._id.hostel[0]
      if (index != -1) {
        event_sports_arr[index][String(hostel)] = item.details[0].points
      } else {
        const event_obj = {
          event_name: item.details[0].event_name[0],
          [String(hostel)]: item.details[0].points
        }
        event_sports_arr.push(event_obj)
      }
    })

    event_spectrum.forEach((item) => {
      let index = event_spectrum_arr.find((ele) => {
        return ele.event_name == item.details[0].event_name[0]
      })
      hostel = item._id.hostel[0]
      if (index != -1) {
        event_spectrum_arr[index][String(hostel)] = item.details[0].points
      } else {
        const event_obj = {
          event_name: item.details[0].event_name[0],
          [String(hostel)]: item.details[0].points
        }
        event_spectrum_arr.push(event_obj)
      }
    })

    const returnData = {
      standings: {
        culturals: culturalTotals,
        spectrum: spectrumTotals,
        sports: sportsTotals
      },
      total: total,
      recents: recents,
      events_score: {
        culturals: event_culturals_arr,
        sports: event_sports_arr,
        spectrum: event_spectrum_arr
      }
    }

    return res.send({ 'scoreData': scoreData, 'totals': totalData, 'data': returnData })
  } catch (error) {
    return res.status(500).send(error)
  }
}

function pointsMapper(item) {
  return {
    name: item._id.hostel[0],
    points: item.hostel_total_points
  }
}

async function getTotalByHostel() {
  try {
    const totals = await Score.aggregate([
      {
        $lookup: {
          from: 'events',
          localField: 'event',
          foreignField: '_id',
          as: 'event'
        }
      },
      {
        $lookup: {
          from: 'hostels',
          localField: 'hostel',
          foreignField: '_id',
          as: 'hostel'
        }
      },
      { $group: { '_id': { 'cup': '$event.cup', 'hostel': '$hostel.name' }, 'hostel_total_points': { $sum: '$points' } } }, { '$sort': { 'hostel_total_points': -1 } }])
    console.log('debug', totals)
    return totals
  } catch (error) {
    logger.error(error)
  }
}

var getEventScores = async function getEventScores(eventId) {
  const scoreData = await Score.find({ 'event': eventId }).exec()
  return scoreData
}

module.exports = {
  showScoreboard: showScoreboard,
  getEventScores: getEventScores
}
