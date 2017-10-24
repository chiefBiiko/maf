/* get.js */

const levelup = require('level')

const db = levelup('test.db')

db.get('hello', (err, value) => {
  if (err) return console.error(err)
  console.log(value)
})