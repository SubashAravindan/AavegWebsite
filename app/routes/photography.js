const express = require('express')
const router = express.Router()
const photographyController = require('../controllers/photographyController')
const adminAuthController = require('../controllers/adminAuthController.js')
const studentController = require('../controllers/studentAuthController')

router.get('/photography', studentController.checkStudentLogin, photographyController.showPhotographyForm)
router.post('/photography', studentController.checkStudentLogin, photographyController.validate, photographyController.submitEntry)
router.get('/admin/photography/excel', adminAuthController.checkAdminLogin, photographyController.getExcel)

module.exports = router
