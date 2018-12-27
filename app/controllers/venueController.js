const Venues = require('../models/Venue.js')

exports.getVenues = async () => {
  const venueData = await Venues.find({}).exec()
  return venueData
}

exports.getVenueById = async (id) => {
  const venue = await Venues.findById(id).exec()
  return venue
}

exports.getVenueData = async (req, res) => {
  try {
    const venueData = await Venues.find({}).exec()
    return res.send(venueData)
  } catch (error) {
    return res.status(500).send(error)
  }
}
