module.exports = class WsServerEvent {
  constructor() {
    this.error = null
    this.errors = {
      invalid_json_string: 'Please send a valid JSON string',
      invalid_request_method: 'Invalid or missing request method',
      invalid_request_channel: 'Invalid or missing request channel',
      invalid_request_params: 'Invalid or missing request params array',
    }
    this.methods = {
      sub: 'subscribe',
      unsub: 'unsubscribe',
    }
    this.channels = {}
  }

  isSubMethod(event) {
    return event.method === this.methods.sub
  }

  isUnsubMethod(event) {
    return event.method === this.methods.unsub
  }

  hasChannel(event) {
    return this.channels[event.channel] !== undefined
  }

  setChannels(channels) {
    this.channels = channels
  }

  getChannels() {
    return Object.values(this.channels)
  }

  getMethods() {
    return Object.values(this.methods)
  }

  validate(event) {
    if (typeof event !== 'object') {
      this.error = this.errors.invalid_json_string

      return false
    }

    if (!this.getMethods().includes(event.method)) {
      this.error = this.errors.invalid_request_method

      return false
    }

    if (!this.getChannels().includes(event.channel)) {
      this.error = this.errors.invalid_request_channel

      return false
    }

    if (!Array.isArray(event.params)) {
      this.error = this.errors.invalid_request_params

      return false
    }

    return true
  }
}
