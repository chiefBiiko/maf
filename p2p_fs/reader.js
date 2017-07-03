/* reader.js */

const fs = require('fs')
const pump = require('pump')

pump(fs.createReadStream(__filename), process.stdout, err => {
  if (err) throw err
})