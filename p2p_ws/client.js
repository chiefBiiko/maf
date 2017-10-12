/* client.js */

const net = require('net')
const jsonStream = require('duplex-json-stream')
const lookup = require('lookup-multicast-dns/global')
const user = process.argv[2]

const socket = jsonStream(net.connect(65080, 'broker.local'))

process.stdin.on('data', data => {
  socket.write({user: user, msg: data.toString().trim()})
  process.stdout.write(`${user}> ${data.toString().trim()}\n`)
})

socket.on('data', data => {
  process.stdout.write(`${data.user}> ${data.msg}\n`)
})