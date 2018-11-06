const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
  name: 'string',
  cup: 'string',
  points: {
    first: 'number',
    second: 'number',
    third: 'number'
  },
  firstPlace: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hostel'
  }
  ],
  secondPlace: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hostel'
  }
  ],
  thirdPlace: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hostel'
  }
  ],
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
