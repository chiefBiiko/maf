/* server.js */

const fs = require('fs')
const http = require('http')
const pump = require('pump')


http.createServer((req, res) => {
  pump(fs.createReadStream(__filename), res, err => {
    if (err) throw err
  })
}).listen(10419, 'localhost', () => console.log('l.o.p. 10419'))