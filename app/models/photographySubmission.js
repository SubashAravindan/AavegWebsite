const mongoose = require('mongoose')

const photographyDetailSchema = new mongoose.Schema({
  name: 'string',
  rollNumber: 'string',
  device: 'string',
  phoneNumber: 'number',
  category: 'string',
  hostel: 'string',
  email: 'string',
  link: 'string'
})

module.exports = mongoose.model('PhotographyDetail', photographyDetailSchema)
