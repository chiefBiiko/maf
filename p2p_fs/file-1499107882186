/* tcpserver.js */

const net = require('net')
const fs = require('fs')
const pump = require('pump')

net.createServer(socket => {
  pump(fs.createReadStream(__filename), socket, err => {
    if (err) throw err
  })
}).listen(10419, 'localhost', () => console.log('l.o.p. 10419'))