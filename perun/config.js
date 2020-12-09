const { app } = require('electron')
const path = require('path')
const userData = app.getPath('userData')
const dbName = 'perun.db'
exports.dbPath = path.join(userData, dbName)
exports.SIZE_1MB = 1024*1024
