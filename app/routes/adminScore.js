const express = require('express')
const router = express.Router()
const adminScoreboardController = require('../controllers/adminScoreboardController.js')

router.get('/admin/scoreboard', adminScoreboardController.showScoreForm)
router.post('/admin/scoreboard', adminScoreboardController.createScore)

module.exports = router
