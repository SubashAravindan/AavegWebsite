const express = require('express')
const app = express()
const engine = require('ejs-locals')
const bodyParser = require('body-parser')
const session = require('express-session')
const mongoose = require('mongoose')
const passport = require('passport')
const helmet = require('helmet')
const path = require('path')
const methodOverride = require('method-override')
const logger = require('./config/winston.js')
const config = require('./config/config.js')
const adminAuthRoutes = require('./app/routes/adminAuth.js')
const studentAuthRoutes = require('./app/routes/studentAuth.js')
const photographyRoutes = require('./app/routes/photography')
const tshirtRoutes = require('./app/routes/tshirtReg.js')
const hostelRoutes = require('./app/routes/hostel.js')
const authSetup = require('./app/utils/authSetup')
// ==================Middleware================

app.use(express.static(path.join(__dirname, 'public')))
app.use(helmet())
app.engine('ejs', engine)
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
mongoose.connect(config.dbURI)

app.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true
  })
)
authSetup(passport, app)
// =============Routes=============

app.get('/', (req, res) => {
  res.render('timer')
})

app.use(photographyRoutes)
app.use(studentAuthRoutes)
app.use(adminAuthRoutes)
app.use(tshirtRoutes)
app.get('*', (req, res) => {
  res.render('comingSoon', { url: req.url })
})
app.use(hostelRoutes)

app.listen(config.port, () => {
  logger.info(`Server started on port ${config.port}`)
})
