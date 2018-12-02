const mongoose = require('mongoose')

const tshirtDetailSchema = new mongoose.Schema({
  hostel: 'string',
  size: 'string',
  rollNumber: 'number'
})

module.exports = mongoose.model('TshirtDetail', tshirtDetailSchema)
