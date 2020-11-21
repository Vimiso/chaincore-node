module.exports = class Response {
  constructor() {
    //
  }

  create(success, message, results = {}, errors = {}) {
    return {
      success: success,
      message: message,
      results: results,
      errors: errors,
    }
  }
}
