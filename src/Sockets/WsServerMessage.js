module.exports = class WsServerMessage {
  constructor() {
    //
  }

  parse(message) {
    let parsed = {}

    try {
      parsed = JSON.parse(message)
    } catch (e) {
      console.log(`Failed to parse message: ${message}`)

      return false
    }

    return parsed
  }

  makeEvent(channel, results) {
    return this.make(true, null, channel, 'event', results)
  }

  makeSuccess(message) {
    return this.make(true, message, null, 'success', {})
  }

  makeFailure(message) {
    return this.make(false, message, null, 'failure', {})
  }

  make(success, message, channel, method, results) {
    return {
      success: success,
      message: message,
      channel: channel,
      method: method,
      results: results,
    }
  }
}
