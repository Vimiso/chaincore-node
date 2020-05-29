module.exports = class Chaincore
{
  constructor(chains, api)
  {
    this.chains = chains
    this.api = api
    this.valid = Object.keys(this.chains)

    this.bootParams()
    this.bootRoutes()

    this.api.start()
  }

  bootParams()
  {
    this.api.server.param('chain', (req, res, next) => {
      if (this.valid.includes(req.params.chain)) {
        return next()
      }

      return res.status(400).json({
        success: false,
        message: 'Invalid chain',
        results: {},
      })
    })
  }

  bootRoutes()
  {
    this.initGetPeerInfoRoute()
    this.initGetNetworkInfoRoute()
    this.initGetMiningInfoRoute()
    this.initGetBlocksRoute()
    this.initGetBlocksTipRoute()
    this.initGetBlockRoute()
    this.initGetRawMempoolRoute()
    this.initGetTxRoute()
    this.initSendRawTxRoute()
  }

  initGetPeerInfoRoute()
  {
    this.api.server.get('/api/:chain/peer', async (req, res, next) => {
      try {
        let chain = req.params.chain
        let result = await this.chains[chain].rpc.getPeerInfo()

        console.log('API showing peer info')

        return res.status(200).json({
          success: true,
          message: `Showing peer info`,
          results: result,
        })
      } catch (err) {
        return next(err)
      }
    })
  }

  initGetNetworkInfoRoute()
  {
    this.api.server.get('/api/:chain/network', async (req, res, next) => {
      try {
        let chain = req.params.chain
        let result = await this.chains[chain].rpc.getNetworkInfo()

        console.log('API showing network info')

        return res.status(200).json({
          success: true,
          message: `Showing network info`,
          results: result,
        })
      } catch (err) {
        return next(err)
      }
    })
  }

  initGetMiningInfoRoute()
  {
    this.api.server.get('/api/:chain/mining', async (req, res, next) => {
      try {
        let chain = req.params.chain
        let result = await this.chains[chain].rpc.getMiningInfo()

        console.log('API showing mining info')

        return res.status(200).json({
          success: true,
          message: `Showing mining info`,
          results: result,
        })
      } catch (err) {
        return next(err)
      }
    })
  }

  initGetBlocksRoute()
  {
    this.api.server.get('/api/:chain/blocks', async (req, res, next) => {
      let blocks = []
      let i = 0
      let max = 5
      let chain = req.params.chain

      try {
        let height = await this.chains[chain].rpc.getBlockHeight()

        while (i < max) {
          let hash = await this.chains[chain].rpc.getBlockHash(height)

          blocks.push({height: height, hash: hash})

          i++
          height--;
        }

        console.log('API showing blocks')

        return res.status(200).json({
          success: true,
          message: `Showing ${max} latest blocks`,
          results: blocks
        })
      } catch (err) {
        return next(err)
      }
    })
  }

  initGetBlocksTipRoute()
  {
    this.api.server.get('/api/:chain/blocks/tip', async (req, res, next) => {
      try {
        let chain = req.params.chain
        let tip = await this.chains[chain].rpc.getBlockHeight()
        let hash = await this.chains[chain].rpc.getBlockHash(tip)
        let block = await this.chains[chain].rpc.getBlock(hash)

        console.log(`API showing best block`)

        return res.status(200).json({
          success: true,
          message: `Showing best block`,
          results: block,
        })
      } catch (err) {
        return next(err)
      }
    })
  }

  initGetBlockRoute()
  {
    this.api.server.get('/api/:chain/block/:hash', async (req, res, next) => {
      try {
        let chain = req.params.chain
        let hash = req.params.hash
        let result = await this.chains[chain].rpc.getBlock(hash)

        console.log(`API showing block: ${hash}`)

        return res.status(200).json({
          success: true,
          message: `Showing block`,
          results: result,
        })
      } catch (err) {
        return next(err)
      }
    })
  }

  initGetRawMempoolRoute()
  {
    this.api.server.get('/api/:chain/mempool', async (req, res, next) => {
      try {
        let chain = req.params.chain
        let result = await this.chains[chain].rpc.getRawMempool()

        console.log('API showing mempool')

        return res.status(200).json({
          success: true,
          message: `Showing mempool`,
          results: result,
        })
      } catch (err) {
        return next(err)
      }
    })
  }

  initGetTxRoute()
  {
    this.api.server.get('/api/:chain/tx/:txId', async (req, res, next) => {
      try {
        let chain = req.params.chain
        let txId = req.params.txId
        let hex = await this.chains[chain].rpc.getRawTx(txId)
        let tx = await this.chains[chain].rpc.getDecodedTx(hex)

        console.log(`API showing tx: ${txId}`)

        return res.status(200).json({
          success: true,
          message: `API showing tx`,
          results: tx,
        })
      } catch (err) {
        return next(err)
      }
    })
  }

  initSendRawTxRoute()
  {
    this.api.server.get('/api/:chain/sendrawtx/:hex', async (req, res, next) => {
      try {
        let chain = req.params.chain
        let hex = req.params.hex
        let result = await this.chains[chain].rpc.sendRawTx(hx)

        console.log(`API sent raw tx: ${tx}`)

        return res.status(200).json({
          success: true,
          message: `Sent raw tx`,
          results: result,
        })
      } catch (err) {
        return next(err)
      }
    })
  }
}
