const imaps = require('imap-simple')
const logger = require('../../config/winston.js')
const config = require('../../config/config')

exports.showLogin = (req, res) => {
  res.render('auth/student/login', { title: 'Login' })
}

exports.login = async (req, res) => {
  let config = {
    imap: {
      user: req.body.rollnumber,
      password: req.body.password,
      host: '203.129.195.133',
      port: 143,
      tls: false,
      authTimeout: 30000
    }
  }

  imaps.connect(config).then(connection => {
    req.logout()
    req.session.rollnumber = req.body.rollnumber
    req.session.type = 'student'
    req.session.save()
    logger.info(`student ${req.session.rollnumber} logged in`)
    res.redirect('/')
  }).catch(err => {
    logger.error(err)
    return res.redirect(config.APP_BASE_URL + 'studentLogin')
  })
}

exports.checkStudentLogin = (req, res, next) => {
  if (req.session.rollnumber && req.session.type === 'student') {
    next()
  } else {
    res.redirect(config.APP_BASE_URL + 'studentLogin')
  }
}

exports.logout = (req, res) => {
  req.logout()
  req.session.destroy()
  res.redirect('/')
}
exports.logOutFromAdmin = (req, res, next) => {
  req.logout()
  next()
}
