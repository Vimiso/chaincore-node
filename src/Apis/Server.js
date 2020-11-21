const express = require('express')
const Response = require(`${process.env.root}/src/Apis/Response`)

module.exports = class Server {
  constructor(config) {
    this.config = config
    this.server = express()
    this.response = new Response()
  }

  getReqIp(req) {
    return req.headers['x-forwarded-for'] || req.connection.remoteAddress
  }

  start() {
    this.server.listen(this.config.port, () => {
      console.log(`API started on port: ${this.config.port}`)
    })

    this.server.use((err, req, res, next) => {
      console.error(`API request error: ${err.message}`)

      const errors = err.response ? err.response.data.error : {}

      return res
        .status(500)
        .json(this.response.create(false, err.message, {}, errors))
    })
  }
}
