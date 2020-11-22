const { BrowserWindow, screen } = require('electron')
const path = require('path')
const fetch = require('cross-fetch') // required 'fetch'
const { ElectronBlocker } = require('@cliqz/adblocker-electron')
const { logger } = require('./log')


const openWebsite = (url) => {
  logger.log(`open website ${url}`)
  if(!url.startsWith('http') && !url.startsWith('file://')) {
    url = `http://${url}`
  }
  const { width, height } = screen.getPrimaryDisplay().workAreaSize

  const b = global.mainWindow.getBounds()
  const bwindow = new BrowserWindow({
    parent: global.mainWindow,
    x: 0,
    y: 0,
    width,
    height,
    //frame: false,
    transparent: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'website.preload.js')
    },
  })
  // clear session storage each time
  const session = bwindow.webContents.session
  session.clearStorageData()

  // load web content extension
  session.loadExtension(path.join(__dirname, './extension/web-content')).then((ext) => {
    logger.log(ext.manifest)
    // Load ads tracking extension
    ElectronBlocker.fromPrebuiltAdsAndTracking(fetch).then((blocker) => {
      blocker.enableBlockingInSession(session)
    })
    /*session.webRequest.onBeforeRequest({urls:['<all_urls>']}, (details, callback) => {
      logger.log(details);
      callback({cancel: false});
    });*/

    // Load data web page
    bwindow.loadURL(url)
    /*bwindow.once('did-finish-load', (e) => {
       logger.log('loaded', e);
    });
    bwindow.webContents.once('dom-ready', (e) => {
      logger.log('loaded2', e);
      bwindow.webContents.executeJavaScript('({data:Array.from(document.querySelectorAll("img")).map((i) => i.src)})', true).then((body) => {
        logger.log(body);
      });
    })*/
  }).catch((e) => {
    logger.error(e)
  })
}

exports.openWebsite = openWebsite
