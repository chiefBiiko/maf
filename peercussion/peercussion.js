const discoverySwarm = require('discovery-swarm')
const hashToPort = require('hash-to-port')
const levelup = require('level')
const scuttleup = require('scuttleup')

const panic = msg => {
  console.error(msg)
  process.exit(1)
}

const me = process.argv[2]
const channel = process.argv[3]
const help = 'usage: node peercussion me channel dht dns\n' +
  '  me\t\tyour displayed name\n  channel\tthe channel to join\n' +
  '  dht\t\tuse the bittorent DHT for discovery? default: true\n' +
  '  dns\t\t\tuse (local) multicast DNS discovery? default: true'

if (!me || !channel || process.argv.slice(2).some(a => /-?h(elp)?$/i.test(a)))
  panic(help)

const logs = scuttleup(levelup(`${me}.db`), { valueEncoding: 'json' })
process.stdin.on('data', data => {
  if (!/^\s*$/.test(data.toString()))
    logs.append({ username: me, message: data.toString().trim() })
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
swarm.listen(hashToPort(me))
swarm.join(channel, { announce: true })

