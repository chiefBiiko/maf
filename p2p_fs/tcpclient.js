/* tcpclient.js */

const channel = require('discovery-channel')({dht: false})
const channelId = process.argv[2]
const net = require('net')
const pump = require('pump')
const fs = require('fs')
const hashStream = require('hash-of-stream')

channel.join(channelId)

channel.once('peer', (id, peer) => {
  const socket = net.connect(peer.port, peer.host)
  const fileName = `file-${Date.now()}`
  const writeStream = fs.createWriteStream(fileName)
  var readStream
  console.log(`[connected to a peer: ${JSON.stringify(peer)}]`)
  console.log('[streaming inbound file to disk]')
  pump(socket, writeStream, err => {
    if (err) throw err
    readStream = fs.createReadStream(fileName)
    hashStream(readStream, hash => console.log(hash === channelId))
  })
})
