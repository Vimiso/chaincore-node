const Zeromq = require('zeromq')

module.exports = class ZmqSub
{
  constructor(config)
  {
    this.protocol = config.protocol || 'tcp'
    this.host = config.host
    this.port = config.port
    this.resource = `${this.protocol}://${this.host}:${this.port}`

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
