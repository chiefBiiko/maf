/* tcpclient.js */

const net = require('net')
const pump = require('pump')
const fs = require('fs')

const socket = net.connect(10419, 'localhost')

pump(socket, fs.createWriteStream(`file-${Date.now()}`), err => {
  if (err) throw err
})