/* external ip hook */

const publicIp = require('public-ip')

publicIp.v4().then(console.log)