const Hostels = require('../models/Hostel.js')

exports.getHostels = async () => {
  const hostelData = await Hostels.find({}).exec()
  return hostelData
}

exports.getHostelById = async (id) => {
  const hostel = await Hostels.findById(id).exec()
  return hostel
}

exports.getHostelData = async (req, res) => {
  try {
    const hostelData = await Hostels.find({}).exec()
    return res.send(hostelData)
  } catch (error) {
    return res.status(500).send(error)
  }
}
