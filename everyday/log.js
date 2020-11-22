
const logDebug = (...args) => {
  console.debug(...args);
}

const logLog = (...args) => {
  console.log(...args);
}

const logWarn = (...args) => {
  console.warn(...args);
}

const logError = (...args) => {
  console.error(...args);
}

exports.logger = {
  log: logLog,
  debug: logDebug,
  warn: logWarn,
  error: logError,
}
