const discoverySwarm = require('discovery-swarm')
const hashToPort = require('hash-to-port')
const levelup = require('level')
const scuttleup = require('scuttleup')

const me = process.argv[2]
const channel = process.argv[3]
if (!me || !channel || process.argv.slice(2).some(a => /-?h(elp)?$/i.test(a))) {
  console.error('p2p chat\nusage: node peercussion me channel [dht] [dns]\n' +
    '  me\t\tyour displayed name\n  channel\tthe channel to join\n' +
    '  dht\t\tuse the bittorent DHT for discovery? default: true\n' +
    '  dns\t\tuse (local) multicast DNS discovery? default: true')
  process.exit(1)
}

const logs = scuttleup(levelup(`${me}.db`), { valueEncoding: 'json' })
process.stdin.on('data', data => {
  const msg = data.toString().trim()
  if (msg) logs.append({ username: me, message: msg })
})
logs.createReadStream({ live: true }).on('data', data => {
  console.log(`${data.entry.username}> ${data.entry.message}`)
})

const swarm = discoverySwarm({ 
  dht: !/false/i.test(process.argv[4]), 
  dns: !/false/i.test(process.argv[5])
})
swarm.on('connection', (socket, peer) => {
  console.log(`[ new peer connection from ${peer.host}:${peer.port} ]`)
  socket.pipe(logs.createReplicationStream({ live: true })).pipe(socket)
})
swarm.listen(/false/i.test(process.argv[4]) ? hashToPort(me) : 80)
swarm.join(channel, { announce: true })
