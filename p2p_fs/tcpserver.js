/* tcpserver.js */

const channel = require('discovery-channel')({dht: false})
const channelId = process.argv[2]
const port = Number(process.argv[3])
const net = require('net')
const fs = require('fs')
const pump = require('pump')

channel.join(channelId, port)

net.createServer(socket => {
  console.log(`[a peer connected: ${JSON.stringify(socket.address())}]`)
  console.log(`[serving file ${__filename}]`)
  pump(fs.createReadStream(__filename), socket, err => {
    if (err) throw err
  })
}).listen(port, '0.0.0.0', () => console.log(`l.o.p. ${port}`))