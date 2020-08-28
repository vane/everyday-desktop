const fs = require('fs');
const { dialog } = require('electron');

const openFile = (fileNames) => {
  const p = new Promise((resolve, reject) => {
    dialog.showOpenDialog().then((fileNames) => {
      if(fileNames === undefined){
          reject("No file selected");
      } else {
        fs.readFile(fileNames.filePaths[0], 'utf-8', (err, data) => {
          if(err){
            reject("An error ocurred reading the file :" + err.message);
          } else {
            resolve(data);
          }
        });
      }
    });
  });
  return p
}

exports.openFile = openFile
