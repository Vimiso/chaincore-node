const BaseClient = require(`${process.env.root}/src/Rpcs/BaseClient`)

module.exports = class Client extends BaseClient
{
  getPeerInfo()
  {
    return this.buildRequest('getPeerInfo').then(resp => {
      return resp.data.result
    }).catch(err => {
      throw err
    })
  }

  getNetworkInfo()
  {
    return this.buildRequest('getNetworkInfo').then(resp => {
      return resp.data.result
    }).catch(err => {
      throw err
    })
  }

  getMiningInfo()
  {
    return this.buildRequest('getMiningInfo').then(resp => {
      return resp.data.result
    }).catch(err => {
      throw err
    })
  }

  getBlockHeight()
  {
    return this.buildRequest('getBlockCount').then(resp => {
      return resp.data.result
    }).catch(err => {
      throw err
    })
  }

  getBlock(hash)
  {
    return this.buildRequest('getBlock', [hash]).then(resp => {
      return resp.data.result
    }).catch(err => {
      throw err
    })
  }

  getBlockHash(height)
  {
    return this.buildRequest('getBlockHash', [height]).then(resp => {
      return resp.data.result
    }).catch(err => {
      throw err
    })
  }

  getRawMempool()
  {
    return this.buildRequest('getRawMempool').then(resp => {
      return resp.data.result
    }).catch(err => {
      throw err
    })
  }

  getDecodedTx(hex)
  {
    return this.buildRequest('decodeRawTransaction', [hex]).then(resp => {
      return resp.data.result
    }).catch(err => {
      throw err
    })
  }

  getRawTx(txId)
  {
    return this.buildRequest('getRawTransaction', [txId]).then(resp => {
      return resp.data.result
    }).catch(err => {
      throw err
    })
  }

  sendRawTx(hex)
  {
    return this.buildRequest('sendRawTransaction', [hex]).then(resp => {
      return resp.data.result
    }).catch(err => {
      throw err
    })
  }
}
