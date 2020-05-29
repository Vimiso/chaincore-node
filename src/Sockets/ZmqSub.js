const Zeromq = require('zeromq')

module.exports = class ZmqSub
{
  constructor(host, port)
  {
    this.pcol = 'tcp'
    this.host = host
    this.port = port
    this.resource = `${this.pcol}://${this.host}:${this.port}`

    this.zmq = Zeromq.socket('sub')
    this.zmq.connect(this.resource)

    console.log(`ZMQ connected on port: ${this.port}`)
  }

  sub(channels)
  {
    channels.forEach(channel => {
      this.zmq.subscribe(channel)
    })
  }

  onMessage(callback)
  {
    this.zmq.on('message', (topic, message) => {
      callback(topic, message)
    })
  }
}
