/* peer.js */

const hashToPort = require('hash-to-port')
const topology = require('fully-connected-topology')
const register = require('register-multicast-dns')
const levelup = require('level')
const scuttleup = require('scuttleup')

const toAddress = username => `${username}.local:${hashToPort(username)}`
const me = process.argv[2]
const peers = process.argv.slice(3)
const swarm = topology(toAddress(me), peers.map(toAddress))
const logs = scuttleup(levelup(`${me}.db`), {valueEncoding: 'json'})

require('lookup-multicast-dns/global')  // now program resolves .local domains
register(me)                            // register me alias 4 local network ip

swarm.on('connection', (socket, peer) => {
  console.log(`[${peer} connected]`)
  socket.pipe(logs.createReplicationStream({live: true})).pipe(socket)
})

logs.createReadStream({live: true}).on('data', data => {
  console.log(`${data.entry.username}> ${data.entry.message}`)
})

process.stdin.on('data', data => {
  logs.append({username: me, message: data.toString().trim()})
})