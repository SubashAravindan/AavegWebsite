const passport = require('passport')
const Admin = require('../models/Admin.js')
const accessList = require('../../config/adminAccess.js')
const logger = require('../../config/winston.js')

exports.showLogin = (req, res) => {
  res.render('auth/login')
}

exports.showRegister = (req, res) => {
  res.render('auth/register')
}

exports.authenticate = passport.authenticate('local',
  {
    successRedirect: '/',
    failureRedirect: '/login'
  })

exports.logout = (req, res) => {
  req.logout()
  res.redirect('/')
}

exports.register = (req, res) => {
  const newAdmin = {
    username: req.body.username,
    permissions: accessList[req.body.username]
  }
  Admin.register(new Admin(newAdmin), req.body.password, (err, newAdmin) => {
    if (err) {
      logger.error(err.message)
      return res.redirect('/register')
    } else {
      passport.authenticate('local')(req, res, () => {
        res.redirect('/')
      })
    }
  })
}
// Check if the admin should be allowed to register
exports.checkAdminAccess = (req, res, next) => {
  if (Object.keys(accessList).includes(req.body.username)) {
    next()
  } else {
    logger.warn(`Access denied for ${req.body.username}`)
    res.redirect('/register') // Need to dsiplay a message saying access denied
  }
}

exports.checkAdminLogin = (req, res, next) => {
  if (req.user) {
    return next()
  } else {
    res.redirect('/login')
  }
}
