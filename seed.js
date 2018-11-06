const { dbURI } = require('./config/config.js')
module.exports = {
  'undefined': `${dbURI}`,
  'dev': `${dbURI}`,
  'prod': `${dbURI}` }
