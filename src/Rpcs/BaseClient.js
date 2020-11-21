const axios = require('axios')

module.exports = class BaseClient {
  constructor(config) {
    this.user = config.user
    this.pass = config.pass
    this.host = config.host
    this.port = config.port
    this.protocol = config.protocol || 'http'
    this.timeout = config.timeout || 10000
  }

  buildBody(method, params) {
    return {
      jsonrpc: '1.0',
      id: Date.now(),
      method: method.toLowerCase(),
      params: params || [],
    }
  }

  request(method, params) {
    const request = {
      method: 'POST',
      timeout: this.timeout,
      url: `${this.protocol}://${this.host}:${this.port}`,
      auth: {username: `${this.user}`, password: `${this.pass}`},
      headers: {'Content-Type': 'application/json'},
      data: JSON.stringify(this.buildBody(method, params)),
    }

    return axios(request)
  }

  getPeerInfo() {
    return this.request('getPeerInfo')
      .then((resp) => {
        return resp.data.result
      })
      .catch((err) => {
        throw err
      })
  }

  getNetworkInfo() {
    return this.request('getNetworkInfo')
      .then((resp) => {
        return resp.data.result
      })
      .catch((err) => {
        throw err
      })
  }

  getMiningInfo() {
    return this.request('getMiningInfo')
      .then((resp) => {
        return resp.data.result
      })
      .catch((err) => {
        throw err
      })
  }

  getBlockHeight() {
    return this.request('getBlockCount')
      .then((resp) => {
        return resp.data.result
      })
      .catch((err) => {
        throw err
      })
  }

  getBlock(hash) {
    return this.request('getBlock', [hash])
      .then((resp) => {
        return resp.data.result
      })
      .catch((err) => {
        throw err
      })
  }

  getBlockHash(height) {
    return this.request('getBlockHash', [height])
      .then((resp) => {
        return resp.data.result
      })
      .catch((err) => {
        throw err
      })
  }

  getRawMempool() {
    return this.request('getRawMempool')
      .then((resp) => {
        return resp.data.result
      })
      .catch((err) => {
        throw err
      })
  }

  getRawTx(txId) {
    return this.request('getRawTransaction', [txId, true])
      .then((resp) => {
        return resp.data.result
      })
      .catch((err) => {
        throw err
      })
  }

  importAddress(address, rescan = false, label = '') {
    const parameters = [address, label, rescan]

    return this.request('importAddress', parameters)
      .then((resp) => {
        return resp.data.result
      })
      .catch((err) => {
        throw err
      })
  }

  listUnspent(address, minConfirmations, maxConfirmations = 9999999) {
    const parameters = [minConfirmations, maxConfirmations, [address]]

    return this.request('listUnspent', parameters)
      .then((resp) => {
        return resp.data.result
      })
      .catch((err) => {
        throw err
      })
  }

  sendRawTx(hex) {
    return this.request('sendRawTransaction', [hex])
      .then((resp) => {
        return resp.data.result
      })
      .catch((err) => {
        throw err
      })
  }
}
