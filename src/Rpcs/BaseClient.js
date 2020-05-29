const axios = require('axios')

module.exports = class BaseClient
{
  constructor(user, pass, host, port, pcol)
  {
    this.timeout = 10000
    this.pcol = pcol || 'http'
    this.user = user
    this.pass = pass
    this.host = host
    this.port = port
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

  buildRequest(method, params) {
    let req = {
      method: 'POST',
      timeout: this.timeout,
      url: `${this.pcol}://${this.host}:${this.port}`,
      auth: {username: `${this.user}`, password: `${this.pass}`},
      headers: {'Content-Type': 'application/json'},
      data: JSON.stringify(this.buildBody(method, params))
    }

    return axios(req)
  }
}
