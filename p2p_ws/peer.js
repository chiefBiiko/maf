/* peer.js */

const hashToPort = require('hash-to-port')
const topology = require('fully-connected-topology')
const register = require('register-multicast-dns')
const jsonStream = require('duplex-json-stream')
const streamSet = require('stream-set')()

const toAddress = username => `${username}.local:${hashToPort(username)}`
const me = process.argv[2]
const peers = process.argv.slice(3)
const swarm = topology(toAddress(me), peers.map(toAddress))
const received = {}
const id = Math.random().toString()
var seq = 0

require('lookup-multicast-dns/global')  // now program resolves .local domains
register(me)                            // register me alias 4 local network ip

swarm.on('connection', (socket, peer) => {
  console.log(`[${peer} connected]`)
  socket = jsonStream(socket)
  socket.on('data', data => {
    if (received.hasOwnProperty(data.from) &&
        data.seq <= received[data.from].seq) {
      return    
    } else if ((!received.hasOwnProperty(data.from) || 
               received[data.from].msg !== data.msg) &&
               data.peer !== me) {
      console.log(`${data.peer}> ${data.msg}`)
    }
    received[data.from] = {seq: data.seq, msg: data.msg}
    streamSet.forEach(openSocket => openSocket.write(data))
  })
  streamSet.add(socket)
})

process.stdin.on('data', data => {
  const msg = data.toString().trim()
  const inc = seq++
  streamSet.forEach(openSocket => {
    openSocket.write({from: id, seq: inc, peer: me, msg: msg})
  })
})