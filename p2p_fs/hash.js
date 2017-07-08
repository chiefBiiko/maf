/* hash.js */

const fs = require('fs')
const pump = require('pump')
const crypto = require('crypto')

const stream = fs.createReadStream(process.argv[2])
const hash = crypto.createHash('sha256')

stream.on('data', chunk => {
  hash.update(chunk.toString())
})

stream.on('end', () => {
  console.log(hash.digest('hex'))
})
