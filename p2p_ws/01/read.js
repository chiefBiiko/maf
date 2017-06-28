/* read.js */

const levelup = require('level')
const scuttleup = require('scuttleup')

const logs = scuttleup(levelup('logs.db'))
const stream = logs.createReadStream({valueEcnoding: 'utf-8'})

stream.on('data', data => console.log(data))