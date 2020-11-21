module.exports = class Chaincore {
  constructor(chains, wss) {
    this.chains = chains
    this.wss = wss
    this.wss.event.setChannels(this.getChannels())
    this.wss.start()
  }

  getChannels() {
    const channels = {}

    Object.keys(this.chains).forEach((chain) => {
      this.chains[chain].zmq.sub(['hashblock', 'hashtx', 'rawtx'])
      this.chains[chain].zmq.onMessage((topic, message) => {
        this.handleMessage(chain, topic.toString(), message.toString('hex'))
      })

      channels[`${chain}:block`] = `${chain}:block`
      channels[`${chain}:tx`] = `${chain}:tx`
      channels[`${chain}:utxo`] = `${chain}:utxo`
    })

    return channels
  }

  handleMessage(chain, topic, message) {
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

  handleBlock(chain, topic, message) {
    const channel = this.wss.event.channels[`${chain}:block`]
    const blockHash = message

    console.log(`[${channel}] ${message}`)

    for (let ws of this.wss.getClients()) {
      if (this.wss.hasClientSub(ws, channel)) {
        const message = this.wss.message.makeEvent(channel, {blockHash: blockHash})

        this.wss.sendClient(ws, message)
      }
    }
  }

  handleTx(chain, topic, message) {
    const channel = this.wss.event.channels[`${chain}:tx`]
    const txId = message

    console.log(`[${channel}] ${message}`)

    for (let ws of this.wss.getClients()) {
      if (this.wss.hasClientSub(ws, channel)) {
        const message = this.wss.message.makeEvent(channel, {txId: txId})

        this.wss.sendClient(ws, message)
      }
    }
  }

  handleRawTx(chain, topic, message) {
    const channel = this.wss.event.channels[`${chain}:utxo`]
    const utxos = this.chains[chain].tsf.txToUtxos(message)

    console.log(`[${channel}] ${message.substring(0, 64)}...`)

    for (let ws of this.wss.getClients()) {
      if (this.wss.hasClientSub(ws, channel)) {
        utxos.forEach((utxo) => {
          const message = this.wss.message.makeEvent(channel, utxo)

          this.wss.sendClient(ws, message)
        })
      }
    }
  }
}
