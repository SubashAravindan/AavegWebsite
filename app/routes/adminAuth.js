const express = require('express')
const router = express.Router()
const adminAuthController = require('../controllers/adminAuthController.js')

router.get('/login', adminAuthController.showLogin)
router.post('/login', adminAuthController.authenticate, (req, res) => {})
router.get('/register', adminAuthController.showRegister)
router.get('/logout', adminAuthController.checkAdminLogin, adminAuthController.logout)
router.post('/register', adminAuthController.checkAdminAccess, adminAuthController.register)

module.exports = router
