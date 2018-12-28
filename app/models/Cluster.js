const mongoose = require('mongoose')

const clusterSchema = new mongoose.Schema({
  name: 'string'
})

module.exports = mongoose.model('Cluster', clusterSchema)
