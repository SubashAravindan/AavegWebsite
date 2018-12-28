const express = require('express')
const router = express.Router()
const scoreController = require('../controllers/scoreboardController.js')
const adminScoreboardController = require('../controllers/adminScoreboardController.js')
const adminAuthController = require('../controllers/adminAuthController.js')

router.get('/admin/scoreboard', adminAuthController.checkAdminLogin, adminScoreboardController.showScoreForm)
router.post('/admin/scoreboard',adminAuthController.checkAdminLogin, adminScoreboardController.createScore)
router.get('/api/scoreboard', scoreController.showScoreboard)
router.get('/getPoints', adminScoreboardController.getPoints)

module.exports = router
