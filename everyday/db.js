const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const { userData } = require('./config');
const dbpath = path.join(userData, 'everyday.db');
const firstStart = !fs.existsSync(dbpath);
const db = new sqlite3.Database(dbpath);

const start = () => {
  db.serialize(function() {
    if(firstStart) {
      db.run("CREATE TABLE if not exists lorem (info TEXT)");
      var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
      for (var i = 0; i < 10; i++) {
          stmt.run("Ipsum " + i);
      }
      stmt.finalize();

      db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
          console.log(row.id + ": " + row.info);
      });
    }

  });

  //db.close();
};

exports.db = start;
