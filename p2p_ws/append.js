/* append.js */

const levelup = require('level')
const scuttleup = require('scuttleup')

const logs = scuttleup(levelup('logs.db'))

logs.append('hello world')