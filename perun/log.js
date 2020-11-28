const { app } = require('electron')
const path = require('path')
const fs = require('fs')

let logPath = null
if (app) {
  const userData = app.getPath('userData')

  const formatLogTime = () => {
    let dateString = ''
    const dt = new Date()
    if (dt.getDate() < 10) {
      dateString += '0'
    }
    dateString += `${dt.getDate()}-`
    if (dt.getMonth() < 9) {
      dateString += '0'
    }
    dateString += `${dt.getMonth() + 1}-`
    dateString += `${dt.getFullYear()}`
    return dateString
  }
  logPath = path.join(userData, `log.${formatLogTime()}.log`)
}

const logDebug = (...args) => {
  console.debug(...args)
  if (logPath) fs.writeFileSync(logPath, args.join(' '))
}

const logLog = (...args) => {
  console.log(...args)
  if (logPath) fs.writeFileSync(logPath, args.join(' '))
}

const logWarn = (...args) => {
  console.warn(...args)
  if (logPath) fs.writeFileSync(logPath, args.join(' '))
}

const logError = (...args) => {
  console.error(...args)
  if (logPath) fs.writeFileSync(logPath, args.join(' '))
}

exports.logger = {
  log: logLog,
  debug: logDebug,
  warn: logWarn,
  error: logError,
}
