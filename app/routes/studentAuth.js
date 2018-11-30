const express = require('express')
const router = express.Router()
const studentAuthController = require('../controllers/studentAuthController.js')

router.get('/studentLogin', studentAuthController.showLogin)
router.post('/studentLogin', studentAuthController.logOutFromAdmin, studentAuthController.login)
router.get('/studentLogout', studentAuthController.checkStudentLogin, studentAuthController.logout)

module.exports = router
