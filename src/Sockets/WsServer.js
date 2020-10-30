const crypto = require('crypto')
const https = require('https')
const WebSocket = require('ws')
const Interval = require(`${process.env.root}/src/Support/Helpers/Interval`)
const WsServerEvent = require(`${process.env.root}/src/Sockets/WsServerEvent`)
const WsServerMessage = require(`${process.env.root}/src/Sockets/WsServerMessage`)

module.exports = class WsServer {
  constructor(config) {
    this.wss
    this.config = config
    this.heartbeatInterval = 10000
    this.intervals = new Interval()
    this.event = new WsServerEvent()
    this.message = new WsServerMessage()
  }

  configIsSsl() {
    return this.config.cert && this.config.key
  }

  start() {
    let sslServer = null

    if (this.configIsSsl()) {
      sslServer = https.createServer({
        cert: fs.readFileSync(this.config.cert),
        key: fs.readFileSync(this.config.key),
      })

      this.wss = new WebSocket.Server({sslServer})
    } else {
      this.wss = new WebSocket.Server(this.config)
    }

    this.wss.on('connection', (ws, req) => {
      this.setupClient(ws, req)
    })

    this.wss.on('listening', () => {
      console.log(`WSS started on port: ${this.config.port}`)

      this.heartbeat()
    })

    this.wss.on('error', (e) => {
      throw e
    })

    this.wss.on('close', () => {
      throw new Error('WSS closed')
    })

    if (sslServer) {
      sslServer.listen(this.config.port)
    }

    return this
  }

  heartbeat() {
    this.intervals.forget('heartbeat')
    this.intervals.set(
      'heartbeat',
      () => {
        this.broadcastPing()
      },
      this.heartbeatInterval
    )
  }

  setupClient(ws, req) {
    ws.subs = {}
    ws.id = crypto.randomBytes(20).toString('hex')
    ws.ip = this.getClientIp(ws, req)

    this.makeClientSubbable(ws)

    console.log(`WSS client connected [${ws.id}][${ws.ip}]`)
    console.log(`WSS total clients [${this.getClientsCount()}]`)

    ws.on('error', (err) => {
      throw err
    })

    ws.on('close', () => {
      console.log(`WSS client disconnected [${ws.id}][${ws.ip}]`)
      console.log(`WSS total clients [${this.getClientsCount()}]`)
    })
  }

  makeClientSubbable(ws) {
    ws.on('message', (message) => {
      let event = this.message.parse(message)

      if (!this.event.validate(event)) {
        console.log(`WSS client error [${ws.id}][${ws.ip}] [${this.event.error}]`)

        return this.sendClient(ws, this.message.makeFailure(this.event.error))
      }

      if (this.event.isUnsubMethod(event)) {
        return this.forgetClientSub(ws, event.channel)
      }

      if (this.event.isSubMethod(event)) {
        return this.setClientSub(ws, event.channel, {})
      }
    })
  }

  hasClientSub(ws, channel) {
    return this.getClientSub(ws, channel) !== undefined
  }

  getClients() {
    return this.wss.clients.values()
  }

  getClientsCount() {
    return this.wss.clients.size
  }

  getClientIp(ws, req) {
    let forwarded = req.headers['x-forwarded-for']

    if (forwarded) {
      return forwarded.split(/\s*,\s*/)[0]
    }

    return req.socket.remoteAddress
  }

  getClientSub(ws, channel) {
    return ws.subs[channel]
  }

  setClientSub(ws, channel, params) {
    console.log(`WSS client sub [${ws.id}][${ws.ip}] [${channel}]`)

    ws.subs[channel] = {params: params}
  }

  forgetClientSub(ws, channel) {
    console.log(`WSS client unsub [${ws.id}][${ws.ip}] [${channel}]`)

    delete ws.subs[channel]
  }

  flushClientSubs(ws) {
    console.log(`WSS client flush subs [${ws.id}][${ws.ip}]`)

    ws.subs = {}
  }

  sendClient(ws, message) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message))
    }
  }

  pingClient(ws) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.ping()
    }
  }

  broadcast(message) {
    console.log('WSS broadcasting message to all clients...')

    for (let ws of this.getClients()) {
      this.sendClient(ws, message)
    }
  }

  broadcastPing(message) {
    console.log('WSS broadcasting ping to all clients...')

    for (let ws of this.getClients()) {
      this.pingClient(ws)
    }
  }
}
