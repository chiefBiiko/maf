/* peer.js */

const streamSet = require('stream-set')()
const jsonStream = require('duplex-json-stream')
const topology = require('fully-connected-topology')
const hashToPort = require('hash-to-port')
const register = require('register-multicast-dns')

const toAddress = username => `${username}.local:${hashToPort(username)}`
const me = process.argv[2]
const peers = process.argv.slice(3)
const swarm = topology(toAddress(me), peers.map(toAddress))
const received = {}
const id = Math.random()
var seq = 0

require('lookup-multicast-dns/global')  // now program resolves .local domains

register(me)

swarm.on('connection', (socket, peer) => {
  console.log(`[${peer} connected]`)
  socket = jsonStream(socket)
  socket.on('data', data => {
    if (data.seq <= received[data.from]) return
    received[data.from] = data.seq
    console.log(`${data.peer}> ${data.msg}`)
    streamSet.forEach(openSocket => {
      if (openSocket !== socket && 
          !peer.startsWith(data.peer)) openSocket.write(data)
    })
  })
  streamSet.add(socket)
})

process.stdin.on('data', data => {
  const msg = data.toString().trim()
  streamSet.forEach(openSocket => {
    openSocket.write({from: id, seq: seq++, peer: me, msg: msg})
  })
})