const mongoose = require('mongoose')

const venueSchema = new mongoose.Schema({
  name: 'string',
  lat: 'number',
  lng: 'number'
})

module.exports = mongoose.model('Venue', venueSchema)
