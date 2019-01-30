const logger = require('../../config/winston.js')
const Score = require('../models/Score.js')

const showScoreboard = async (req, res) => {
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
      { $group: { _id: { 'cup': '$event.cup', 'hostel': '$hostel.name', 'position': '$position' }, details: { $push: { event_id: '$event._id', event_name: '$event.name', points: '$points', 'date': '$event.endTime' } } } },
      { $sort: { 'event.date': -1 } }]).exec()

    const totalData = await getTotalByHostel()

    let culturalTotals = []
    let sportsTotals = []
    let spectrumTotals = []
    let culturalTotalsObj = {}
    let sportsTotalsObj = {}
    let spectrumTotalsObj = {}
    const total = {}
    const eventCulturals = []
    const eventSports = []
    const eventSpectrum = []
    const eventCulturalsArr = []
    const eventSportsArr = []
    const eventSpectrumArr = []
    const recents = {}

    totalData.forEach((item) => {
      if (item._id.cup[0] == 'Culturals') { culturalTotals.push(item) }// By default its in decending order
      if (item._id.cup[0] == 'Sports') { sportsTotals.push(item) }
      if (item._id.cup[0] == 'Spectrum') { spectrumTotals.push(item) }

      let hostel = item._id.hostel[0]
      if (total[String(hostel)] != undefined) { total[String(hostel)] += item.hostel_total_points } else { total[String(hostel)] = item.hostel_total_points }
    })

    culturalTotals = culturalTotals.map(pointsMapper)
    sportsTotals = sportsTotals.map(pointsMapper)
    spectrumTotals = spectrumTotals.map(pointsMapper)
    culturalTotals.forEach((item) => {
      culturalTotalsObj[item.name] = item.points
    })
    sportsTotals.forEach((item) => {
      sportsTotalsObj[item.name] = item.points
    })
    spectrumTotals.forEach((item) => {
      spectrumTotalsObj[item.name] = item.points
    })

    scoreData.forEach((item) => {
      if (item._id.cup[0] == 'Culturals') { eventCulturals.push(item) }
      if (item._id.cup[0] == 'Spectrum') { eventSpectrum.push(item) }
      if (item._id.cup[0] == 'Sports') { eventSports.push(item) }

      let hostel = item._id.hostel[0]
      if (recents[String(hostel)] == undefined) {
        recents[String(hostel)] = []
      }

      if (recents[String(hostel)].length < 3) {
        const recentObj = {
          event_name: item.details[0].event_name[0],
          position: getOrdinalNumber(item._id.position)
        }

        recents[String(hostel)].push(recentObj)
      }
    })

    eventCulturals.forEach((item) => {
      for (let i = 0; i < item.details.length; i++) {
        let index = eventCulturalsArr.findIndex((ele) => {
          return ele.event_name == item.details[i].event_name[0]
        })
        let hostel = item._id.hostel[0]
        if (index != -1) {
          if (eventCulturalsArr[index][String(hostel)] === undefined) {
            eventCulturalsArr[index][String(hostel)] = item.details[i].points
          }
          else {
            eventCulturalsArr[index][String(hostel)] += item.details[i].points
          }
        } else {
          const event_obj = {
            event_name: item.details[i].event_name[0],
            [String(hostel)]: item.details[i].points
          }
          eventCulturalsArr.push(event_obj)
        }
      }
    })

    eventSports.forEach((item) => {
      for (let i = 0; i < item.details.length; i++) {
        let index = eventSportsArr.findIndex((ele) => {
          return ele.event_name == item.details[i].event_name[0]
        })
        let hostel = item._id.hostel[0]

        if (index != -1) {
          if (eventSportsArr[index][String(hostel)] === undefined) {
            eventSportsArr[index][String(hostel)] = item.details[i].points
          }
          else {
            eventSportsArr[index][String(hostel)] += item.details[i].points
          }
        } else {
          const event_obj = {
            event_name: item.details[i].event_name[0],
            [String(hostel)]: item.details[i].points
          }
          eventSportsArr.push(event_obj)
        }
      }
    })
    eventSpectrum.forEach((item) => {
      for (let i = 0; i < item.details.length; i++) {
        let index = eventSpectrumArr.findIndex((ele) => {
          return ele.event_name == item.details[i].event_name[0]
        })
        let hostel = item._id.hostel[0]
        if (index != -1) {
          if (eventSpectrumArr[index][String(hostel)] === undefined) {
            eventSpectrumArr[index][String(hostel)] = item.details[i].points
          }
          else {
            eventSpectrumArr[index][String(hostel)] += item.details[i].points
          }
        } else {
          const event_obj = {
            event_name: item.details[i].event_name[0],
            [String(hostel)]: item.details[i].points
          }
          eventSpectrumArr.push(event_obj)
        }
      }
    })
    const returnData = {
      standings: {
        culturals: culturalTotalsObj,
        spectrum: spectrumTotalsObj,
        sports: sportsTotalsObj
      },
      total: total,
      recents: recents,
      events_score: {
        culturals: eventCulturalsArr,
        sports: eventSportsArr,
        spectrum: eventSpectrumArr
      }
    }

    return res.render('scoreboard/scoreboard', { scoreData: scoreData, totals: totalData, data: returnData, title: 'Scoreboard' })
  } catch (error) {
    console.log(error)
    return res.status(500).send(error)
  }
}

function pointsMapper(item) {
  return {
    name: item._id.hostel[0],
    points: item.hostel_total_points
  }
}

function getOrdinalNumber(number) {
  switch (number) {
    case 1: return '1st'
    case 2: return '2nd'
    case 3: return '3rd'
    default: return number + 'th'
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
    return totals
  } catch (error) {
    logger.error(error)
  }
}

const getEventScores = async function getEventScores(eventId) {
  const scoreData = await Score.find({ 'event': eventId }).populate('hostel').exec()
  let returnData = {}
  scoreData.forEach(score => {
    if (typeof returnData[score.position] === 'undefined') {
      returnData[score.position] = []
    }
    returnData[score.position].push(score.hostel.name)
  })
  return returnData
}

const getScoreData = async (req, res) => {
  const scoreData = await Score.find().populate('hostel').populate('event','name').exec()
  res.send(scoreData)
}


module.exports = {
  showScoreboard,
  getEventScores,
  getScoreData
}
