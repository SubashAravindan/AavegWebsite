const express = require('express')
const router = express.Router()
const hostelController = require('../controllers/hostelController.js')

router.get('/api/hostels', hostelController.getHostelData)

module.exports = router
