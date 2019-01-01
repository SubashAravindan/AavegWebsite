const logger = require('../../config/winston.js')
const PhotographyDetail = require('../models/photographySubmission.js')
const hostelController = require('../controllers/hostelController')
const { check, validationResult } = require('express-validator/check')
const json2csv = require('json2csv').parse
const adminController = require('../controllers/adminAuthController')

exports.showPhotographyForm = async (req, res) => {
  if (await exceedSubmissionLimit(req.session.rollnumber)) {
    res.render('error', { title: 'Error', error: 'You have already made 4 submissions' })
  } else {
    res.render('photography/photography', { title: 'Photography', hostelNames: await hostelController.getHostels(), submitted: false })
  }
}

async function exceedSubmissionLimit (rollnumber) {
  try {
    const studentSubmission = await PhotographyDetail.find({ rollNumber: rollnumber }).exec()
    return studentSubmission.length >= 4
  } catch (error) {
    logger.error(error)
    throw new Error(error)
  }
}

exports.submitEntry = async (req, res) => {
  if (await exceedSubmissionLimit(req.session.rollnumber)) {
    res.render('error', { title: 'Error', error: 'You have already made 4 submissions' })
  } else {
    const errors = validationResult(req).array()
    if (errors.length) {
      const errorMessages = errors.map(error => error.msg)
      res.render('error', { title: 'Error', error: errorMessages })
    } else {
      const { name, rollNumber, device, phoneNumber, category, hostel, email, link } = req.body
      try {
        const newEntry = await PhotographyDetail.create({ name, rollNumber, device, phoneNumber, category, hostel, email, link })
        logger.info(`Submission accepted for ${rollNumber}, with id ${newEntry._id}`)
        res.render('photography/photography', {
          title: 'Photography',
          hostelNames: await hostelController.getHostels(),
          submitted: true
        })
      } catch (error) {
        logger.error(error)
        res.status(500).send(error)
      }
    }
  }
}

exports.getExcel = async (req, res) => {
  try {
    const photoData = await PhotographyDetail.find({}).exec()
    const fields = ['name', 'rollNumber', 'device', 'phoneNumber', 'category', 'hostel', 'email', 'link']
    const opts = { fields }
    const data = json2csv(photoData, opts)
    res.attachment('photography.csv')
    res.status(200).send(data)
  } catch (err) {
    logger.error(err)
    res.status(500).send(err)
  }
}

exports.validate = [
  check('rollNumber')
    .custom((rollno, { req }) => {
      if (req.session.rollnumber !== rollno) {
        throw new Error('Session and given rollnumber doesn\'t match')
      } else {
        return true
      }
    })
    .custom(async (rollNumber) => {
      const admins = await adminController.getAdminUsernames()
      if (rollNumber.toString()[5] !== '8' && !admins.includes(rollNumber)) {
        throw new Error('This is only for first years. 7 kazhutha vayasu aachu, first year fest la enna da vela? ')
      } else {
        return true
      }
    }),
  check('email').isEmail().trim(),
  check('name').isLength({ min: 1 }),
  check('device').isLength({ min: 1 }),
  check('phoneNumber').isNumeric().isLength({ min: 1 }),
  check('link').isURL(),
  check('category').isIn(['mobile', 'camera']),
  check('hostel')
    .exists().withMessage('Hostel name missing')
    .custom(async (hostel) => {
      const hostelData = await hostelController.getHostels()
      const hostelNames = hostelData.map(hostel => hostel.name)
      if (!hostelNames.includes(hostel)) {
        throw new Error('Hostel data incorrect')
      } else {
        return true
      }
    })
]
