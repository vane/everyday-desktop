class PerunError extends Error {
  constructor (message, code) {
    super(message)
    this.code = code
  }
}

exports.PerunError = PerunError
