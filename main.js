const { app, BrowserWindow, ipcMain } = require('electron');
const { ElectronBlocker } = require('@cliqz/adblocker-electron');
const fetch = require('cross-fetch'); // required 'fetch'
const path = require('path');
const url = require('url');
const { exec } = require('child_process');
const { openFile } = require('./everyday/file');
const { db } = require('./everyday/db');

global.model =  {
  os: process.platform,
  version: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron,
  },
  errorCode: 0,
  tabs: {}
};

global.ctrl = {};
global.ctrl.openFile = openFile;
global.ctrl.openWebsite = (url) => {
  console.log(`open website ${url}`);
  if(!url.startsWith('http') && !url.startsWith('file://')) {
    url = `http://${url}`;
  }
  const b = global.win.getBounds();
  const v = new BrowserWindow({
    parent: global.win,
    x: b.x,
    y: b.y + 50,
    width: 800,
    height: 600,
    //frame: false,
    transparent: false,
    webPreferences: {
      nodeIntegration: false,
    },
  });
  try {
    const s = v.webContents.session;
    ElectronBlocker.fromPrebuiltAdsAndTracking(fetch).then((blocker) => {
      blocker.enableBlockingInSession(s);
    });
    s.webRequest.onBeforeRequest({urls:['<all_urls>']}, function(details, callback) {
      console.log(details);
      callback({cancel: false});
    });
    v.loadURL(url);
    v.once('did-finish-load', (e) => {
       console.log('loaded');
    });
    v.webContents.once('dom-ready', (e) => {
      console.log('loaded2');
    })
  } catch (e) {
    console.log(e)
  }
}
global.ctrl.db = db;

const executeCommand = (cmd) => {
  const p = new Promise((resolve, reject) => {
    const output = {
      error: null,
      stdout: '',
      stderr: '',
      code: -1,
    }
    const proc = exec(cmd, (error, stdout, stderr) => {
      output.error = error;
      output.stdout = stdout;
      output.stderr = stderr;
      resolve(output)
    });
    proc.on('exit', (code) => {
      output.code = code
    });
  });
  return p
}

const createWindow = () => {
  // Create the browser window.
  global.win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })
  global.win.loadURL(url.format({
      pathname: path.join(__dirname, './index.html'),
      protocol: 'file:',
      slashes: true
  }));
}

app.whenReady().then(createWindow)

app.on("window-all-closed", function () {
  //if (process.platform !== "darwin") {
    app.quit();
  //}
});
