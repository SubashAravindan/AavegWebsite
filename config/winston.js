const winston = require('winston')
const path = require('path')
const rootDir = path.parse(__dirname).dir
console.log(rootDir);

module.exports = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple(),
    winston.format.printf(msg => 
      winston.format.colorize().colorize(msg.level, JSON.stringify({level:msg.level, timestamp:msg.timestamp, message:msg.message}))
    )
    ),
  transports: [
    new winston.transports.Console({ level: 'silly' }),
    new winston.transports.File({ filename: `${rootDir}/logs/errors.log`, level: 'error' }),
    new winston.transports.File({ filename: `${rootDir}/logs/warnings.log`, level: 'warn' }),
    new winston.transports.File({ filename: `${rootDir}/logs/info.log`, level: 'info' })
  ]
})
