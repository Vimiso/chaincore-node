module.exports = class Chaincore
{
  constructor(chains, wss)
  {
    this.chains = chains
    this.wss = wss
    this.subbable = ['hashblock', 'hashtx', 'rawtx']

    let channels = {}

    Object.keys(this.chains).forEach(chain => {
      this.chains[chain].zmq.sub(this.subbable)
      this.chains[chain].zmq.on('message').then((topic, message) => {
        this.handleMessage(chain, topic.toString(), message.toString('hex'))
      })

      channels[`${chain}:block`] = `${chain}:block`
      channels[`${chain}:tx`] = `${chain}:tx`
      channels[`${chain}:utxo`] = `${chain}:utxo`
    })

    this.wss.event.setChannels(channels)
    this.wss.start()
  }

  handleMessage(chain, topic, message)
  {
    if (topic === 'hashblock') {
      return this.handleBlock(chain, topic, message)
    }

    if (topic === 'hashtx') {
      return this.handleTx(chain, topic, message)
    }

    if (topic === 'rawtx') {
      return this.handleRawTx(chain, topic, message)
    }
  }

  handleBlock(chain, topic, message)
  {
    let channel = this.wss.event.channels[`${chain}:block`]
    let blockHash = message

    console.log(`[${channel}] ${message}`)

    for (let ws of this.wss.getClients()) {
      if (this.wss.hasClientSub(ws, channel)) {
        let message = this.wss.message.makeEvent(channel, {blockHash: blockHash})

        this.wss.sendClient(ws, message)
      }
    }
  }

  handleTx(chain, topic, message)
  {
    let channel = this.wss.event.channels[`${chain}:tx`]
    let txId = message

    console.log(`[${channel}] ${message}`)

    for (let ws of this.wss.getClients()) {
      if (this.wss.hasClientSub(ws, channel)) {
        let message = this.wss.message.makeEvent(channel, {txId: txId})

        this.wss.sendClient(ws, message)
      }
    }
  }

  handleRawTx(chain, topic, message)
  {
    let channel = this.wss.event.channels[`${chain}:utxo`]
    let utxos = this.chains[chain].tsf.txToUtxos(message)

    console.log(`[${channel}] ${message.substring(0, 64)}...`)

    for (let ws of this.wss.getClients()) {
      if (this.wss.hasClientSub(ws, channel)) {
        utxos.forEach(utxo => {
          let message = this.wss.message.makeEvent(channel, utxo)

          this.wss.sendClient(ws, message)
        })
      }
    }
  }
}
