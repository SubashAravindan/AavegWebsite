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
  startTime: 'date',
  endTime: 'date'
})

module.exports = mongoose.model('Event', eventSchema)
