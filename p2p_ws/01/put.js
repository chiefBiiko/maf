/* put.js */

const levelup = require('level')

const db = levelup('test.db')

db.put('hello', 'world', err => {
  if (err) return console.error(err)
})
