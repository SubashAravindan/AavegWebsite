const Venues = require('../models/Venue.js')

exports.getVenues = async () => {
  try {
    const venueData = Venues.find({}).exec()
    return venueData
  } catch (error) {
    return error
  }
}

exports.getVenueById = async (id) => {
  try {
    const venue = await Venues.findById(id).exec()
    return venue
  } catch (error) {
    return error
  }
}

exports.getVenueData = async (req, res) => {
  try {
    const venueData = await Venues.find({}).exec()
    return res.send(venueData)
  } catch (error) {
    return res.status(500).send(error)
  }
}
