const { dbSelectAsync, dbModifyAsync } = require('../db')

const settingsGet = async ({key}) => {
  const data = await dbSelectAsync(`
    SELECT * FROM settings WHERE key = '${key}'
  `)
  return data[0]
}

exports.settingsGet = settingsGet

exports.settingsSet = async ({key, value}) => {
  const data = settingsGet({key})
  if (data) {
    await dbModifyAsync(`
      UPDATE settings SET value = '${value}' WHERE key = '${key}'
    `)
  } else {
    await dbModifyAsync(`
      INSERT INTO settings (key, value) VALUES ('${key}', '${value}')
    `)
  }
  return data
}
