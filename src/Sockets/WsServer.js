const crypto = require('crypto')
const https = require('https')
const WebSocket = require('ws')
const Interval = require(`${process.env.root}/src/Support/Helpers/Interval`)
const WsServerEvent = require(`${process.env.root}/src/Sockets/WsServerEvent`)
const WsServerMessage = require(`${process.env.root}/src/Sockets/WsServerMessage`)

module.exports = class WsServer
{
  constructor(config)
  {
    this.wss
    this.config = config
    this.intervals = new Interval()
    this.heartbeatInterval = 10000
    this.event = new WsServerEvent()
    this.message = new WsServerMessage()
  }

  configIsSsl()
  {
    return this.config.cert && this.config.key
  }

  start()
  {
    let sslServer = null

    if (this.configIsSsl()) {
      sslServer = https.createServer({
        cert: fs.readFileSync(this.config.cert),
        key: fs.readFileSync(this.config.key)
      })

      this.wss = new WebSocket.Server({sslServer})
    } else {
      this.wss = new WebSocket.Server(this.config)
    }

    this.wss.on('connection', (ws, req) => {
      ws.id = crypto.randomBytes(20).toString('hex')
      ws.subs = {}

      this.makeClientSubbable(ws)

      console.log(`WSS client connected: ${ws.id} - total: ${this.getClientsCount()}`)

      ws.on('error', err => {
        throw err
      })

      ws.on('close', () => {
        console.log(`WSS client disconnected: ${ws.id} - total: ${this.getClientsCount()}`)
      })
    })

    this.wss.on('listening', () => {
      console.log(`WSS started on port: ${this.config.port}`)

      this.heartbeat()
    })

    this.wss.on('error', e => {
      throw e
    })

    this.wss.on('close', () => {
      throw new Error('WSS closed')
    })

    if (this.configIsSsl() && sslServer) {
      sslServer.listen(this.config.port)
    }

    return this
  }

  heartbeat()
  {
    this.intervals.forget('heartbeat')
    this.intervals.set('heartbeat', () => {
      this.broadcastPing()
    }, this.heartbeatInterval)
  }

  makeClientSubbable(ws)
  {
    ws.on('message', message => {
      let event = this.message.parse(message)

      console.log(`WSS received client event: ${ws.id} => ${JSON.stringify(event)}`)

      if (! this.event.validate(event)) {
        console.log(`WSS client: ${ws.id} event error: ${this.event.error}`)

        return this.sendClient(ws, this.message.makeFailure(this.event.error))
      }

      if (this.event.isUnsubMethod(event)) {
        console.log(`WSS client: ${ws.id} unsubbing from: ${event.channel}`)

        return this.forgetClientSub(ws, event.channel)
      }

      if (this.event.isSubMethod(event)) {
        console.log(`WSS client: ${ws.id} subbing to: ${event.channel}`)

        return this.setClientSub(ws, event.channel, {})
      }
    })
  }

  hasClientSub(ws, channel)
  {
    return this.getClientSub(ws, channel) !== undefined
  }

  getClientSub(ws, channel)
  {
    return ws.subs[channel]
  }

  setClientSub(ws, channel, params)
  {
    console.log(`WSS client: ${ws.id} subbing to: ${channel}`)

    ws.subs[channel] = {params: params}
  }

  forgetClientSub(ws, channel)
  {
    console.log(`WSS client: ${ws.id} forgetting sub: ${channel}`)

    delete ws.subs[channel]
  }

  flushClientSubs(ws)
  {
    console.log(`WSS client: ${ws.id} flushing subs`)

    ws.subs = {}
  }

  getClients()
  {
    return this.wss.clients.values()
  }

  getClientsCount()
  {
    return this.wss.clients.size
  }

  sendClient(ws, message)
  {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message))
    }
  }

  pingClient(ws)
  {
    if (ws.readyState === WebSocket.OPEN) {
      ws.ping()
    }
  }

  broadcast(message)
  {
    console.log('WSS broadcasting message to all clients...')

    for (let ws of this.getClients()) {
      this.sendClient(ws, message)
    }
  }

  broadcastPing(message)
  {
    console.log('WSS broadcasting ping to all clients...')

    for (let ws of this.getClients()) {
      this.pingClient(ws)
    }
  }
}
