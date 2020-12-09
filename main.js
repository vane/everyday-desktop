const { app, BrowserWindow, screen, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')
const url = require('url')
const uuid = require('uuid')
const net = require('net')
const { openWebsite } = require('./perun/open.website')
const { dbInitialize, dbSelectAsync, dbModifyAsync } = require('./perun/db')
const { logger } = require('./perun/log')
const {
  workspaceList,
  workspaceSelect,
  workspaceAdd,
  workspaceRemove,
  workspaceDirList,
  workspaceFileRead,
  workspaceFileWrite,
} = require('./perun/ipc/ipc.workspace')
const {
  settingsGet,
  settingsSet
} = require('./perun/ipc/ipc.settings')


/* Web-Content Extension */
const apiUid = uuid.v4()
const apiHost = '127.0.0.1'
let apiUrl = null
let apiPort = null

const checkPortIsFree = async (port) => {
  return new Promise((resolve, reject) => {
    const server = net.createServer()
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        logger.warn(`PORT ${port} in use`)
        resolve(true)
      }
    })
    server.once('listening', () => {
      // close the server if listening doesn't fail
      server.close()
      resolve(false)
    })
    server.listen(port)
  })
}
const newApiPort = async () => {
  const max = 36900
  const min = 36666
  let port = null
  let assigned = true
  while (assigned) {
    port = Math.floor(Math.random() * (max - min) + min)
    assigned = false// await checkPortIsFree(port);
    logger.log(assigned)
  }
  apiPort = port
  apiUrl = `http://${apiHost}:${apiPort}/${apiUid}`
}
const setContentApi = () => {
  const manifestPath = path.join(__dirname, './perun/extension/web-content/manifest.json')
  const manifest = JSON.parse(fs.readFileSync(manifestPath))
  manifest.api = apiUrl
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, '  '))
}

//-------------------
// IPC
//-------------------

/*class IpcRequest {
  constructor (seq, name, data) {
    this.seq = seq;
    this.name = name;
    this.data = data;
  }
}*/

class IpcResponse {
  constructor(seq, status, data) {
    this.seq = seq
    this.status = status
    this.data = data
  }
}

/* Magic between electron browser window and computer */

ipcMain.on('perun-request', async (event, msg) => {
  logger.log('perun-request', msg)
  let status = 200
  let data = null
  switch(msg.name) {
    case 'open.website': {
      openWebsite(msg.data)
      break
    }
    case 'workspace.list': {
      data = await workspaceList()
      break
    }
    case 'workspace.select': {
      await workspaceSelect(msg.data.workspaceId)
      break
    }
    case 'workspace.add': {
      data = await workspaceAdd(msg.data)
      break
    }
    case 'workspace.remove': {
      await workspaceRemove(msg.data)
      break
    }
    case 'workspace.dir.list': {
      try {
        data = await workspaceDirList(msg.data)
      } catch (e) {
        status = e.code
        data = e.message
      }
      break
    }
    case 'workspace.file.read': {
      try {
        data = await workspaceFileRead(msg.data)
      } catch (e) {
        status = e.code
        data = e.message
      }
      break
    }
    case 'workspace.file.write': {
      try {
        await workspaceFileWrite(msg.data)
      } catch (e) {
        status = e.code
        data = e.message
      }
      break
    }
    case 'settings.set': {
      data = await settingsSet(msg.data)
      break
    }
    case 'settings.get': {
      data = await settingsGet(msg.data)
      break
    }
    default: {
      logger.warn('not implemented !')
    }
  }
   // Event emitter for sending asynchronous messages
   event.sender.send('perun-reply', new IpcResponse(msg.seq, status, data))
})

//-------------------
// Main Window
//-------------------

const launchMain = async () => {
  try {
    const firstStart = await dbInitialize()
    await newApiPort()
    setContentApi(false)
    startServer()
  } catch (e) {
    logger.error(e)
    app.quit()
  }
  // Create the browser window.
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  global.mainWindow = new BrowserWindow({
    x: 0,
    y: 0,
    width,
    height,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'main.preload.js')
    }
  })
  await global.mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'public/index.html'),
      protocol: 'file:',
      slashes: true
  }))
}

app.whenReady().then(launchMain)

app.on('window-all-closed', () => {
  //if (process.platform !== "darwin") {
    app.quit()
  //}
})
// clean api url
app.on('before-quit', async () => {
  logger.debug('before quit data')
})

/* API Server */
const readRequestBody = (req) => {
  let body = ''
  return new Promise((resolve, reject) => {
    req.on('data', function (chunk) {
      body += chunk
    })
    req.on('end', () => {
      resolve(body)
    })
  })
}
const startServer = () => {
  const http = require('http')
  const server = http.createServer(async (req, res) => {
    if (req.url === `/${apiUid}`) {
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Access-Control-Allow-Origin', '*')
      const body = await readRequestBody(req)
      logger.log(body)
      const b = JSON.parse(body)
      b.msg = 'Hello world !'
      res.end(JSON.stringify(b))
    } else {
      req.statusCode = 404
      res.end()
    }
  })

  server.listen(apiPort, apiHost, () => {
    logger.log(`Server running at http://${apiHost}:${apiPort}/`)
  })
}
