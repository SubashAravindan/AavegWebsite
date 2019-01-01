const express = require('express')
const router = express.Router()
const photographyController = require('../controllers/photographyController')
const studentController = require('../controllers/studentAuthController')

router.get('/photography', studentController.checkStudentLogin, photographyController.showPhotographyForm)
router.post('/photography', studentController.checkStudentLogin, photographyController.validate, photographyController.submitEntry)
router.get('/admin/photography/excel', photographyController.getExcel)

module.exports = router
