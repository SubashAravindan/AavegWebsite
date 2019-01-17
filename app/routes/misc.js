const express = require('express')
const router = express.Router()

router.get('/about', (req, res) => {
  res.render('about', { title: 'About Aaveg' })
})

router.get('*', (req, res) => {
  res.render('comingSoon', { url: req.url })
})

module.exports = router
