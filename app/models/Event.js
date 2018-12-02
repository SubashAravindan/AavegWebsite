const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
  name: 'string',
  cup: 'string',
  points: ['number'],
  venue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Venue'
  },
  description: 'string',
  rules: 'string',
  startTime: 'string',
  endTime: 'string',
  date: 'string'
})

module.exports = mongoose.model('Event', eventSchema)
