module.exports = class Chaincore {
  constructor(chains, api) {
    this.chains = chains
    this.api = api
    this.specifyParams()
    this.specifyRoutes()
    this.api.start()
  }

  specifyParams() {
    const valid = Object.keys(this.chains)

    this.api.server.param('chain', (req, res, next) => {
      if (valid.includes(req.params.chain)) {
        return next()
      }

      return res.status(400).json(this.api.response.create(false, 'Unsupported chain'))
    })
  }

  specifyRoutes() {
    this.initGetPeerInfoRoute()
    this.initGetNetworkInfoRoute()
    this.initGetMiningInfoRoute()
    this.initGetBlocksRoute()
    this.initGetBlocksTipRoute()
    this.initGetBlocksHeightRoute()
    this.initGetBlockRoute()
    this.initGetRawMempoolRoute()
    this.initGetTxRoute()
    this.initGetBalanceOfAddressRoute()
    this.initGetUtxosOfAddressRoute()
    this.initBroadcastTxRoute()
    this.initImportAddressRoute()
  }

  initGetPeerInfoRoute() {
    const path = '/api/:chain/peer'

    this.api.server.get(path, async (req, res, next) => {
      try {
        const chain = req.params.chain
        const ip = this.api.getReqIp(req)
        const message = `Showing peer info`
        const results = await this.chains[chain].rpc.getPeerInfo()

        console.log(`API [${ip}] [${chain}] get peer info`)

        return res.status(200).json(this.api.response.create(true, message, results))
      } catch (err) {
        return next(err)
      }
    })
  }

  initGetNetworkInfoRoute() {
    const path = '/api/:chain/network'

    this.api.server.get(path, async (req, res, next) => {
      try {
        const chain = req.params.chain
        const ip = this.api.getReqIp(req)
        const message = `Showing network info`
        const results = await this.chains[chain].rpc.getNetworkInfo()

        console.log(`API [${ip}] [${chain}] get network info`)

        return res.status(200).json(this.api.response.create(true, message, results))
      } catch (err) {
        return next(err)
      }
    })
  }

  initGetMiningInfoRoute() {
    const path = '/api/:chain/mining'

    this.api.server.get(path, async (req, res, next) => {
      try {
        const chain = req.params.chain
        const ip = this.api.getReqIp(req)
        const message = `Showing mining info`
        const results = await this.chains[chain].rpc.getMiningInfo()

        console.log(`API [${ip}] [${chain}] get mining info`)

        return res.status(200).json(this.api.response.create(true, message, results))
      } catch (err) {
        return next(err)
      }
    })
  }

  initGetBlocksRoute(amount) {
    const path = '/api/:chain/blocks'

    this.api.server.get(path, async (req, res, next) => {
      let i = 0
      let limit = parseInt(req.query.limit) || 10

      const results = []
      const chain = req.params.chain
      const ip = this.api.getReqIp(req)
      const message = `Showing ${limit} latest blocks`

      if (limit > 50) {
        limit = 50
      }

      try {
        const height = await this.chains[chain].rpc.getBlockHeight()

        while (i < limit) {
          const hash = await this.chains[chain].rpc.getBlockHash(height)

          results.push({height: height, hash: hash})

          i++
          height--
        }

        console.log(`API [${ip}] [${chain}] get blocks`)

        return res.status(200).json(this.api.response.create(true, message, results))
      } catch (err) {
        return next(err)
      }
    })
  }

  initGetBlocksTipRoute() {
    const path = '/api/:chain/blocks/tip'

    this.api.server.get(path, async (req, res, next) => {
      try {
        const chain = req.params.chain
        const ip = this.api.getReqIp(req)
        const message = `Showing best block`
        const tip = await this.chains[chain].rpc.getBlockHeight()
        const hash = await this.chains[chain].rpc.getBlockHash(tip)
        const results = await this.chains[chain].rpc.getBlock(hash)

        console.log(`API [${ip}] [${chain}] get best block`)

        return res.status(200).json(this.api.response.create(true, message, results))
      } catch (err) {
        return next(err)
      }
    })
  }

  initGetBlocksHeightRoute() {
    const path = '/api/:chain/blocks/height'

    this.api.server.get(path, async (req, res, next) => {
      try {
        const chain = req.params.chain
        const ip = this.api.getReqIp(req)
        const message = `Showing blocks height`
        const height = await this.chains[chain].rpc.getBlockHeight()
        const results = {height: height}

        console.log(`API [${ip}] [${chain}] get blocks height`)

        return res.status(200).json(this.api.response.create(true, message, results))
      } catch (err) {
        return next(err)
      }
    })
  }

  initGetBlockRoute() {
    const path = '/api/:chain/block/:hash'

    this.api.server.get(path, async (req, res, next) => {
      try {
        const chain = req.params.chain
        const hash = req.params.hash
        const ip = this.api.getReqIp(req)
        const message = `Showing block`
        const results = await this.chains[chain].rpc.getBlock(hash)

        console.log(`API [${ip}] [${chain}] get block: ${hash}`)

        return res.status(200).json(this.api.response.create(true, message, results))
      } catch (err) {
        return next(err)
      }
    })
  }

  initGetRawMempoolRoute() {
    const path = '/api/:chain/mempool'

    this.api.server.get(path, async (req, res, next) => {
      try {
        const chain = req.params.chain
        const ip = this.api.getReqIp(req)
        const message = `Showing mempool`
        const results = await this.chains[chain].rpc.getRawMempool()

        console.log(`API [${ip}] [${chain}] get mempool`)

        return res.status(200).json(this.api.response.create(true, message, results))
      } catch (err) {
        return next(err)
      }
    })
  }

  initGetTxRoute() {
    const path = '/api/:chain/tx/:txId'

    this.api.server.get(path, async (req, res, next) => {
      try {
        const chain = req.params.chain
        const txId = req.params.txId
        const ip = this.api.getReqIp(req)
        const message = `Showing transaction`
        const results = await this.chains[chain].rpc.getRawTx(txId)

        console.log(`API [${ip}] [${chain}] get tx: ${txId}`)

        return res.status(200).json(this.api.response.create(true, message, results))
      } catch (err) {
        return next(err)
      }
    })
  }

  initGetBalanceOfAddressRoute() {
    const path = '/api/:chain/address/:address/balance'

    this.api.server.get(path, async (req, res, next) => {
      try {
        const chain = req.params.chain
        const address = req.params.address
        const ip = this.api.getReqIp(req)
        const message = `Showing address balance`
        const minConfs = parseInt(req.query.minConfirmations) || 0
        const unspent = await this.chains[chain].rpc.listUnspent(address, minConfs)
        const balance = unspent.reduce((total, item) => total + item.amount, 0)
        const results = {balance: parseFloat(balance.toFixed(8))}

        console.log(`API [${ip}] [${chain}] get balance of address`)

        return res.status(200).json(this.api.response.create(true, message, results))
      } catch (err) {
        return next(err)
      }
    })
  }

  initGetUtxosOfAddressRoute() {
    const path = '/api/:chain/address/:address/utxos'

    this.api.server.get(path, async (req, res, next) => {
      try {
        const chain = req.params.chain
        const address = req.params.address
        const ip = this.api.getReqIp(req)
        const message = `Showing address utxos`
        const minConfs = parseInt(req.query.minConfirmations) || 0
        const results = await this.chains[chain].rpc.listUnspent(address, minConfs)

        console.log(`API [${ip}] [${chain}] get utxos belonging to address`)

        return res.status(200).json(this.api.response.create(true, message, results))
      } catch (err) {
        return next(err)
      }
    })
  }

  initBroadcastTxRoute() {
    const path = '/api/:chain/broadcast/:hex'

    this.api.server.post(path, async (req, res, next) => {
      try {
        const chain = req.params.chain
        const hex = req.params.hex
        const ip = this.api.getReqIp(req)
        const message = `Broadcasted transaction`
        const results = await this.chains[chain].rpc.sendRawTx(hx)

        console.log(`API [${ip}] [${chain}] post broadcast tx`)

        return res.status(200).json(this.api.response.create(true, message, results))
      } catch (err) {
        return next(err)
      }
    })
  }

  initImportAddressRoute() {
    const path = '/api/:chain/address/:address'

    this.api.server.post(path, async (req, res, next) => {
      try {
        const chain = req.params.chain
        const address = req.params.address
        const ip = this.api.getReqIp(req)
        const message = `Imported address without rescanning`
        const rescan = false
        const results = await this.chains[chain].rpc.importAddress(address, rescan)

        console.log(`API [${ip}] [${chain}] post import address: ${address}`)

        return res.status(200).json(this.api.response.create(true, message, results))
      } catch (err) {
        return next(err)
      }
    })
  }
}
