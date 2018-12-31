const TshirtDetail = require('../models/TshirtDetail.js')
const hostelController = require('./hostelController.js')
const { check, validationResult } = require('express-validator/check')
const logger = require('../../config/winston.js')
const json2csv = require('json2csv').parse

exports.displayTshirtForm = async (req, res) => {
  const hostelData = await hostelController.getHostels()
  const hostelNames = hostelData.map(hostel => hostel.name)
  res.render('tshirt/tshirtReg', {
    data: {
      rollno: req.session.rollnumber,
      hostels: hostelNames
    }
  })
}

exports.validate = [
  check('rollno')
    .custom((rollno, { req }) => {
      if (req.session.rollnumber !== rollno) {
        throw new Error('Lmao nice attempt to change rollnumber')
      } else {
        return true
      }
    })
    .custom(rollno => {
      if (rollno.toString()[5] !== '8' && rollno !== '102117058') {
        throw new Error('Aaveg is only for first years. Thanks for remembering aaveg and taking time out to try this :p')
      } else {
        return true
      }
    }),
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
    }),
  check('size')
    .isIn(['s', 'm', 'l', 'xl', 'xxl']).withMessage('Invalid size')
]

exports.savetTshirtData = async (req, res) => {
  const errors = validationResult(req).array()
  if (errors.length) {
    const errorMessages = errors.map(error => error.msg)
    const hostelData = await hostelController.getHostels()
    const hostelNames = hostelData.map(hostel => hostel.name)
    logger.error({ user: req.session.rollnumber, errors: errorMessages })
    let data = req.body
    data.hostels = hostelNames
    res.render('tshirt/tshirtReg', {
      data: data,
      error: errorMessages
    })
  } else {
    logger.info(`Registration done for ${req.session.rollnumber}`)
    let newTshirt = new TshirtDetail()
    newTshirt.hostel = req.body.hostel
    newTshirt.size = req.body.size
    newTshirt.rollNumber = req.session.rollnumber
    newTshirt.save().then(() => {
      res.redirect('/tshirt')
    })
  }
}

exports.getExcel = async (req, res) => {
  try {
    const tshirtData = await TshirtDetail.find({}).exec()
    const fields = ['rollNumber', 'hostel', 'size']
    const opts = { fields }
    const data = json2csv(tshirtData, opts)
    res.attachment('tshirt.csv')
    res.status(200).send(data)
  } catch (err) {
    logger.error(err)
    res.status(500).json(err)
  }
}

exports.registrationCheck = async (req, res, next) => {
  try {
    const tshirtData = await TshirtDetail.find({ rollNumber: req.session.rollnumber }).exec()
    if (tshirtData.length) {
      return res.render('tshirt/alreadyRegistered')
    } else {
      return next()
    }
  } catch (err) {
    logger.error(err)
    res.status(500).send(err)
  }
}
