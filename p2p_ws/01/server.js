/* server.js */

const net = require('net')
const streamSet = require('stream-set')()
const jsonStream = require('duplex-json-stream')
const register = require('register-multicast-dns')
const nickname = process.argv[2]

register(nickname)

const server = net.createServer(peer => {
  peer = jsonStream(peer)
  streamSet.add(peer)
  console.log('[a peer connected]')
  peer.on('data', data => streamSet.forEach(stream => {
    if (stream !== peer) stream.write(data)
  }))
})

server.listen(65080, () => console.log('l.o.p. 65080'))