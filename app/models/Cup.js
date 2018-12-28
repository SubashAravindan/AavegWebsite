const mongoose = require('mongoose')

const cupSchema = new mongoose.Schema({
  name: 'string'
})

module.exports = mongoose.model('Cup', cupSchema)
