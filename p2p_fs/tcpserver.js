/* tcpserver.js */

const channel = require('discovery-channel')({dht: false})
const port = Number(process.argv[3])
const net = require('net')
const fs = require('fs')
const pump = require('pump')
const hashStream = require('hash-of-stream')

hashStream(fs.createReadStream(process.argv[2]), hash => {
  console.log('%s => %s', process.argv[2], hash)
  channel.join(hash, port)
})

net.createServer(socket => {
  console.log(`[a peer connected: ${JSON.stringify(socket.address())}]`)
  console.log(`[serving file ${process.argv[2]}]`)
  pump(fs.createReadStream(process.argv[2]), socket, err => {
    if (err) throw err
  })
}).listen(port, '0.0.0.0', () => console.log(`l.o.p. ${port}`))