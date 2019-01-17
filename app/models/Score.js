const mongoose = require('mongoose')

const scoreSchema = new mongoose.Schema({
  hostel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hostel'
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  },
  position: 'number',
  points: 'number'
})

module.exports = mongoose.model('Score', scoreSchema)
