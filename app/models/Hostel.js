const mongoose = require('mongoose')

const hostelSchema = new mongoose.Schema({
  name: 'string'
})

module.exports = mongoose.model('Hostel', hostelSchema)
