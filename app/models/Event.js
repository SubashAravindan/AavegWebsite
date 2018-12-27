const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
  name: 'string',
  cluster: 'string',
  cup: 'string',
  points: ['number'],
  places: 'number',
  venue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Venue'
  },
  description: 'string',
  rules: 'string',
  date: 'string',
  startTime: 'string',
  endTime: 'string'
})

module.exports = mongoose.model('Event', eventSchema)
