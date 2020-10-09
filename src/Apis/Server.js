const express = require('express')

module.exports = class Server
{
  constructor(config)
  {
    this.config = config
    this.server = express()
  }

  getReqIp(req)
  {
    return req.headers['x-forwarded-for'] || req.connection.remoteAddress
  }

  start()
  {
    this.server.listen(this.config.port, () => {
      console.log(`API started on port: ${this.config.port}`)
    })

    this.server.use((err, req, res, next) => {
      console.error(`API request error: ${err.message}`)

      return res.status(500).json({
        success: false,
        message: err.message,
        results: {},
      })
    })
  }
}
