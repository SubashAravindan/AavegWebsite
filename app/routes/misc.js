const express = require('express')
const router = express.Router()

router.get('/about', (req, res) => {
  res.render('about', { title: 'About Aaveg' })
})

router.get('/schedule', (req, res) => {
  res.download('public/others/Schedule.pdf', 'Schedule.pdf')
})

router.get('/sponsors', (req, res) => {
  res.render('sponsors', { title: 'Sponsors' })
})

// 404
router.get('/team', (req, res) => {
  res.render('team', { title: 'Team' })
})

router.get('*', (req, res) => {
  res.render('error', { error: 'Page not found', title: '404' })
})

module.exports = router
