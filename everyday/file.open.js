const fs = require('fs');
const { dialog } = require('electron');

const fileOpen = (fileNames) => {
  return new Promise((resolve, reject) => {
    dialog.showOpenDialog().then((fileNames) => {
      if(fileNames === undefined){
          reject("No file selected");
      } else {
        fs.readFile(fileNames.filePaths[0], 'utf-8', (err, data) => {
          if(err){
            reject("An error occurred reading the file :" + err.message);
          } else {
            resolve(data);
          }
        });
      }
    });
  });
}

const fileDirOpen = () => {
  return new Promise((resolve, reject) => {
    dialog.showOpenDialog().then(fileNames => {
      console.log(fileNames);
    });
  });
}

exports.fileOpen = fileOpen
exports.fileDirOpen = fileDirOpen
