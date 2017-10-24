/* chat.js */

const discoverySwarm = require('discovery-swarm')
const hashToPort = require('hash-to-port')

const levelup = require('level')
const scuttleup = require('scuttleup')

const me = process.argv[2]
const channel = process.argv[3]

if (!me || !channel || /h(elp)?$/i.test(me)) {
  return console.error('usage: node peercussion.js yourName channel\n' +
                       '  yourName\tyour displayed name\n' +
                       '  channel\tthe channel to join')
} 

const logs = scuttleup(levelup(`${me}.db`), { valueEncoding: 'json' })

process.stdin.on('data', data => {
  logs.append({ username: me, message: data.toString().trim() })
})

logs.createReadStream({ live: true }).on('data', data => {
  console.log(`${data.entry.username}> ${data.entry.message}`)
})

const swarm = discoverySwarm({ 
  stream: logs.createReplicationStream({ live: true }) 
})

swarm.on('connection', (con, info) => console.log('[ new peer connection ]'))

swarm.listen(hashToPort(me))
swarm.join(channel)
