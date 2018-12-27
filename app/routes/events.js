const express = require('express')
const router = express.Router()
const adminAuthController = require('../controllers/adminAuthController.js')
const eventsController = require('../controllers/eventsController.js')

router.get('/admin/events/create', adminAuthController.checkAdminLogin, eventsController.createEventForm)
router.get('/admin/events/edit/:id/', adminAuthController.checkAdminLogin, eventsController.editEventForm)
router.post('/admin/events', adminAuthController.checkAdminLogin, eventsController.saveEventData)
router.delete('/admin/events/:id', adminAuthController.checkAdminLogin, eventsController.deleteEventData)
router.put('/admin/events/:id', adminAuthController.checkAdminLogin, eventsController.editEventData)

module.exports = router
