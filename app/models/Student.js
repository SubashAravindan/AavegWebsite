const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({
  username: String
})

module.exports = mongoose.model('Admin', studentSchema)
