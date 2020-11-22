const sqlite3 = require('sqlite3').verbose()
const fs = require('fs')
const path = require('path')
const { dbPath } = require('./config')
const { logger } = require('./log')
const firstStart = !fs.existsSync(dbPath)
const db = new sqlite3.Database(dbPath)

/**
 * Run statement
 */
const dbRunAsync = (db, stmt) => {
  return new Promise((resolve, reject) => {
    db.run(stmt, (err, res) => {
      if (err) reject(err)
      resolve(res)
    })
  })
}

/**
 * Return all rows
 */
const dbSelectAsync = (db, stmt) => {
  return new Promise((resolve, reject) => {
    db.all(stmt, (err, rows) => {
      if (err) reject(err)
      resolve(rows)
    })
  })
}

const getMigrationFileList = async () => {
  const fileList = []
  return new Promise((resolve) => {
    const migrationPath = path.join(__dirname, 'migrations')
    fs.readdirSync(migrationPath).forEach(fname => {
      fileList.push(fname)
    })
    resolve({
      base: migrationPath,
      fileList: fileList.sort(),
    })
  })
}

const migrateDatabase = async (db) => {
  const migrationFileList = await getMigrationFileList()
  const dbRows = await dbSelectAsync(db, 'SELECT file_name FROM migration')
  const rowMap = {}
  dbRows.forEach((row) => {
    rowMap[row.file_name] = true
  })
  try {
    for (const fpath of migrationFileList.fileList) {
      if (rowMap[fpath]) {
        logger.log('Skipping ', fpath)
        continue
      }
      logger.log('Running ', fpath)
      const mod = require(path.join(migrationFileList.base, fpath))
      try {
        await mod.up(db)
      } catch (e) {
        await mod.down(db)
        throw e
      }
      await dbRunAsync(`INSERT INTO migration (file_name) VALUES ("${fpath}")`)
    }
  } catch (e) {
    logger.error(e)
    throw e
  }
  logger.log('migration complete')
}

const dbInitialize = async () => {
  logger.log('Initialize database')
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS migration (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        file_name TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`, async (err, row) => {
        if (err) {
          reject(err)
          return
        }
        try {
          await migrateDatabase(db)
          resolve(firstStart)
        } catch (e) {
          reject(e)
        }
      })
    })
  })
}

const dbClose = () => {
  db.close()
}

exports.dbInitialize = dbInitialize
exports.dbClose = dbClose
exports.dbSelectAsync = async (stmt) => {
  return await dbSelectAsync(db, stmt)
}
exports.dbModifyAsync = async (stmt) => {
  return await dbRunAsync(db, stmt)
}
