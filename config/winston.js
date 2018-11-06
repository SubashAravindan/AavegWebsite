const winston = require('winston')
const path = require('path')
const rootDir = path.parse(__dirname).dir
module.exports = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize({ all: true }),
    winston.format.simple()

  ),
  transports: [
    new winston.transports.Console({ level: 'silly' }),
    new winston.transports.File({ filename: `${rootDir}/logs/errors.log`, level: 'error' }),
    new winston.transports.File({ filename: `${rootDir}/logs/warnings.log`, level: 'warn' })
  ]
})
