/* tcpclient.js */

const channel = require('discovery-channel')({dht: false})
const channelId = process.argv[2]
const net = require('net')
const pump = require('pump')
const fs = require('fs')

channel.join(channelId)

channel.once('peer', (id, peer) => {
  const socket = net.connect(peer.port, peer.host)
  console.log(`[connected to a peer: ${JSON.stringify(peer)}]`)
  console.log('[streaming inbound file to disk]')
  pump(socket, fs.createWriteStream(`file-${Date.now()}`), err => {
    if (err) throw err
  })
})
