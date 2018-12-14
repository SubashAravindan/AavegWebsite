const express = require('express')
const router = express.Router()
const scoreController = require('../controllers/scoreboardController.js')

router.get('/api/scoreboard', scoreController.showScoreboard)

module.exports = router
