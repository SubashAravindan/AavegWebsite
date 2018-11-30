const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const session = require('express-session')
const mongoose = require('mongoose')
const passport = require('passport')
const helmet = require('helmet')
const path = require('path')
const logger = require('./config/winston.js')
const Admin = require('./app/models/Admin.js')
const LocalStrategy = require('passport-local')
const config = require('./config/config.js')
const adminAuthRoutes = require('./app/routes/adminAuth.js')
const studentAuthRoutes = require('./app/routes/studentAuth.js')
// ==================Middleware================
app.use(helmet())
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, '/public')))

mongoose.connect(config.dbURI)

app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(Admin.authenticate()))
passport.serializeUser(Admin.serializeUser())
passport.deserializeUser(Admin.deserializeUser())
app.use((req, res, next) => {
  res.locals.currentUser = req.user
  next()
})

// =============Routes=============
app.use(adminAuthRoutes)
app.use(studentAuthRoutes)

app.listen(config.port, () => {
  logger.info(`Server started on port ${config.port}`)
})
