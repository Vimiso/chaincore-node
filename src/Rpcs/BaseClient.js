const axios = require('axios')

module.exports = class BaseClient
{
  constructor(user, pass, host, port, protocol, timeout)
  {
    this.user = user
    this.pass = pass
    this.host = host
    this.port = port
    this.protocol = protocol || 'http'
    this.timeout = timeout || 10000
  }

  buildBody(method, params)
  {
    return {
      jsonrpc: '1.0',
      id: Date.now(),
      method: method.toLowerCase(),
      params: params || [],
    }
  }

  request(method, params) {
    let req = {
      method: 'POST',
      timeout: this.timeout,
      url: `${this.protocol}://${this.host}:${this.port}`,
      auth: {username: `${this.user}`, password: `${this.pass}`},
      headers: {'Content-Type': 'application/json'},
      data: JSON.stringify(this.buildBody(method, params))
    }

    return axios(req)
  }

  getPeerInfo()
  {
    return this.request('getPeerInfo').then(resp => {
      return resp.data.result
    }).catch(err => {
      throw err
    })
  }

  getNetworkInfo()
  {
    return this.request('getNetworkInfo').then(resp => {
      return resp.data.result
    }).catch(err => {
      throw err
    })
  }

  getMiningInfo()
  {
    return this.request('getMiningInfo').then(resp => {
      return resp.data.result
    }).catch(err => {
      throw err
    })
  }

  getBlockHeight()
  {
    return this.request('getBlockCount').then(resp => {
      return resp.data.result
    }).catch(err => {
      throw err
    })
  }

  getBlock(hash)
  {
    return this.request('getBlock', [hash]).then(resp => {
      return resp.data.result
    }).catch(err => {
      throw err
    })
  }

  getBlockHash(height)
  {
    return this.request('getBlockHash', [height]).then(resp => {
      return resp.data.result
    }).catch(err => {
      throw err
    })
  }

  getRawMempool()
  {
    return this.request('getRawMempool').then(resp => {
      return resp.data.result
    }).catch(err => {
      throw err
    })
  }

  getDecodedTx(hex)
  {
    return this.request('decodeRawTransaction', [hex]).then(resp => {
      return resp.data.result
    }).catch(err => {
      throw err
    })
  }

  getRawTx(txId)
  {
    return this.request('getRawTransaction', [txId]).then(resp => {
      return resp.data.result
    }).catch(err => {
      throw err
    })
  }

  sendRawTx(hex)
  {
    return this.request('sendRawTransaction', [hex]).then(resp => {
      return resp.data.result
    }).catch(err => {
      throw err
    })
  }
}
