const express = require('express')
const app = express()
const engine = require('ejs-locals')
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
const eventRoutes = require('./app/routes/event.js')
const photographyRoutes = require('./app/routes/photography')
const tshirtRoutes = require('./app/routes/tshirtReg.js')
const hostelRoutes = require('./app/routes/hostel.js')
// ==================Middleware================

app.use(express.static(path.join(__dirname, 'public')))
app.use(helmet())
app.engine('ejs', engine)
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))

mongoose.connect(config.dbURI)

app.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true
  })
)

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(Admin.authenticate()))
passport.serializeUser(Admin.serializeUser())
passport.deserializeUser(Admin.deserializeUser())
app.use((req, res, next) => {
  if (req.session.type === 'student') {
    res.locals.rollnumber = req.session.rollnumber
  } else if (req.session.type === 'admin') {
    res.locals.adminUser = req.user
  }
  next()
})

// =============Routes=============

app.get('/', (req, res) => {
  res.render('timer')
})

app.use(photographyRoutes)
app.use(studentAuthRoutes)
app.get('*', (req, res) => {
  res.render('comingSoon', { url: req.url })
})
app.use(eventRoutes)
app.use(adminAuthRoutes)
app.use(tshirtRoutes)
app.use(hostelRoutes)

app.listen(config.port, () => {
  logger.info(`Server started on port ${config.port}`)
})
