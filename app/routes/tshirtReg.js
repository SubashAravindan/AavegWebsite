const express = require('express')
const router = express.Router()
const tshirtRegController = require('../controllers/tshirtRegistrationController.js')
const studentAuthController = require('../controllers/studentAuthController.js')
const adminAuthController = require('../controllers/adminAuthController.js')

router.get('/tshirt', studentAuthController.checkStudentLogin, tshirtRegController.registrationCheck, tshirtRegController.displayTshirtForm)
router.post('/tshirt', studentAuthController.checkStudentLogin, tshirtRegController.validate, tshirtRegController.savetTshirtData)
router.get('/tshirt/getExcel', adminAuthController.checkAdminLogin, tshirtRegController.getExcel)
module.exports = router
