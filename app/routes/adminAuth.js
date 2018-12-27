const express = require('express')
const router = express.Router()
const adminAuthController = require('../controllers/adminAuthController.js')

router.get('/login', adminAuthController.showLogin)
router.post('/login', adminAuthController.logOutFromStudent, adminAuthController.authenticate, adminAuthController.login)
router.get('/register', adminAuthController.showRegister)
router.get('/logout', adminAuthController.checkAdminLogin, adminAuthController.logout)
router.post('/register', adminAuthController.checkAdminAccess, adminAuthController.register)
router.get('/admin/events/create', adminAuthController.checkAdminLogin, adminAuthController.createEventForm)
router.get('/admin/events/edit/:id/', adminAuthController.checkAdminLogin, adminAuthController.editEventForm)
router.get('/admin/events', adminAuthController.checkAdminLogin, adminAuthController.showEventData)
router.post('/admin/events', adminAuthController.checkAdminLogin, adminAuthController.saveEventData)
router.delete('/admin/events/:id', adminAuthController.checkAdminLogin, adminAuthController.deleteEventData)
router.put('/admin/events/:id', adminAuthController.checkAdminLogin, adminAuthController.editEventData)

module.exports = router
