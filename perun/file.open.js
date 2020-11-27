const fs = require('fs')
const { dialog } = require('electron')

const fileOpen = (fileNames) => {
  return new Promise((resolve, reject) => {
    dialog.showOpenDialog().then((fileNames) => {
      if(fileNames === undefined){
          reject('No file selected')
      } else {
        fs.readFile(fileNames.filePaths[0], 'utf-8', (err, data) => {
          if(err){
            reject('An error occurred reading the file :' + err.message)
          } else {
            resolve(data)
          }
        })
      }
    })
  })
}

const fileDirOpen = (data) => {
  return new Promise((resolve, reject) => {
    if (!data) data = {}
    const props = {
      title: data.title || 'Select directory',
      properties: ['openDirectory']
    }
    dialog.showOpenDialog(props).then(fileNames => {
      if (fileNames.canceled) {
        throw new Error('No directory selected')
      } else {
        const fpath = fileNames.filePaths[0]
        resolve(fpath)
      }
    }).catch((err) => {
      reject(err)
    })
  })
}

exports.fileOpen = fileOpen
exports.fileDirOpen = fileDirOpen
