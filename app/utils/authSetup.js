const Admin = require('../models/Admin.js')
const LocalStrategy = require('passport-local')
const adminAuthController = require('../controllers/adminAuthController')
const config = require('../../config/config')

module.exports = (passport, app) => {
  app.use(passport.initialize())
  app.use(passport.session())
  passport.use(new LocalStrategy(Admin.authenticate()))
  passport.serializeUser(Admin.serializeUser())
  passport.deserializeUser(Admin.deserializeUser())
  app.use('/admin', adminAuthController.checkAdminLogin)
  app.use((req, res, next) => {
    res.locals.baseUrl = config.APP_BASE_URL
    if (req.session.type === 'student') {
      res.locals.rollnumber = req.session.rollnumber
    } else if (req.session.type === 'admin') {
      res.locals.adminUser = req.user
    }
    next()
  })
}
