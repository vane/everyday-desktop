const runAsync = (db, stmt) => {
  return new Promise((resolve, reject) => {
    db.run(stmt, (err, res) => {
      if (err) reject(err);
      resolve(res);
    });
  });
}

const up = async (db) => {
  try {
    await runAsync(db, `CREATE TABLE workspace (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        path TEXT   
      )`);
    await runAsync(db, `
    CREATE TABLE note ( 
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      workspace_id INTEGER NOT NULL,    
      path TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
    await runAsync(db, `
    CREATE TABLE asset ( 
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      note_id INTEGER NOT NULL,    
      path TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
    await runAsync(db, `
    CREATE TABLE tag ( 
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT         
    )`);
    await runAsync(db, `
    CREATE TABLE tag_element ( 
      tag_id INTEGER,
      asset_id INTEGER,
      note_id INTEGER,
      workspace_id INTEGER,
      PRIMARY KEY (tag_id, asset_id)         
    )`)
  } catch (e) {
    throw e;
  }
}

const down = async (db) => {
  try {
    await runAsync(db, 'DROP table if exists workspace')
    await runAsync(db, 'DROP table if exists note')
    await runAsync(db, 'DROP table if exists asset')
    await runAsync(db, 'DROP table if exists tag')
    await runAsync(db, 'DROP table if exists tag_element')
  } catch (e) {
    throw e;
  }
}

exports.up = up;
exports.down = down;
