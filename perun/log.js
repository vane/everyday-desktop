const { app } = require('electron')
const path = require('path')
const fs = require('fs')

let logPath = null

const formatLogTime = (fulltime) => {
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
  if (fulltime) {
    dateString += ' '
    if (dt.getHours() < 10) {
      dateString += '0'
    }
    dateString += `${dt.getHours()}:`
    if (dt.getMinutes() < 10) {
      dateString += '0'
    }
    dateString += `${dt.getMinutes()}:`
    if (dt.getSeconds() < 10) {
      dateString += '0'
    }
    dateString += dt.getSeconds()
  }
  return dateString
}

if (app) {
  const userData = app.getPath('userData')

  logPath = path.join(userData, `perun.${formatLogTime(false)}.log`)
}

const logDebug = (...args) => {
  console.debug(...args)
  if (logPath) fs.writeFileSync(logPath, `${formatLogTime(true)} - ${JSON.stringify(args)}\n`)
}

const logLog = (...args) => {
  console.log(...args)
  if (logPath) fs.writeFileSync(logPath, `${formatLogTime(true)} - ${JSON.stringify(args)}\n`)
}

const logWarn = (...args) => {
  console.warn(...args)
  if (logPath) fs.writeFileSync(logPath, `${formatLogTime(true)} - ${JSON.stringify(args)}\n`)
}

const logError = (...args) => {
  console.error(...args)
  if (logPath) fs.writeFileSync(logPath, `${formatLogTime(true)} - ${JSON.stringify(args)}\n`)
}

exports.logger = {
  log: logLog,
  debug: logDebug,
  warn: logWarn,
  error: logError,
}
