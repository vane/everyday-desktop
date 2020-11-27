const { app, BrowserWindow, screen, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')
const util = require('util')
const url = require('url')
const uuid = require('uuid')
const net = require('net')
const { openWebsite } = require('./perun/open.website')
const { dbInitialize, dbSelectAsync, dbModifyAsync } = require('./perun/db')
const { logger } = require('./perun/log')
const { fileDirOpen } = require('./perun/file.open')


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

ipcMain.on('perun-request', async (event, msg) => {
  logger.log(event, msg)
  let status = 200
  let data = null
  switch(msg.name) {
    case 'open.website': {
      openWebsite(msg.data)
      break
    }
    case 'workspace.list': {
      data = await dbSelectAsync('SELECT * from workspace')
      break
    }
    case 'workspace.dir.select': {
      try {
        const selectedDir = await fileDirOpen()
        let workspaceName = msg.data.workspaceName
        if (!workspaceName) {
          const a = selectedDir.split('/')
          workspaceName = a[a.length - 1]
        }
        const result = await dbModifyAsync(`
        INSERT INTO workspace (name, path, status) 
          VALUES ('${workspaceName}', '${selectedDir}', 1)
        `)
        // Update all other workspaces as not selected
        await dbModifyAsync(`
        UPDATE workspace 
          SET status = 0 
        WHERE status = 1 AND id != ${result.lastID}
        `)
        data = {
          id: result.lastID,
          name: workspaceName,
          path: selectedDir,
          status: 1,
        }
      } catch (e) {
        status = 400
        data = e.message
      }
      break
    }
    case 'workspace.dir.list': {
      const result = await dbSelectAsync(`SELECT * FROM workspace WHERE id = ${msg.data.workspaceId}`)
      if (result.length === 0) {
        status = 400
        data = 'Workspace not found'
        break
      }
      const workspace = result[0]
      const readdir = util.promisify(fs.readdir)
      const stat = util.promisify(fs.stat)

      // Let's trim this cause user can go to other dir using /../../
      let basepath = '/'+msg.data.path.replace(new RegExp('^[/..]+'), '')
      const readpath = `${workspace.path}${basepath}`

      const fdata = await readdir(readpath)
      const files = []
      for (const f of fdata) {
        const fstat = await stat(`${readpath}/${f}`)
        files.push({
          name: f,
          isDir: fstat.isDirectory(),
          size: fstat.size,
        })
      }
      data = {
        path: basepath,
        files: files,
      }
      break
    }
    case 'workspace.file.read': {
      const result = await dbSelectAsync(`SELECT * FROM workspace WHERE id = ${msg.data.workspaceId}`)
      if (result.length === 0) {
        status = 400
        data = 'Workspace not found'
        break
      }
      const workspace = result[0]
      const readfile = util.promisify(fs.readFile)
      let basepath = msg.data.path.replace(new RegExp('^[/..]+'), '')
      const readpath = `${workspace.path}/${basepath}`
      const fdata = await readfile(readpath)
      data = {
        path: basepath,
        ext: path.extname(readpath),
        data: fdata,
      }
      break
    }
    case 'workspace.file.write': {
      const result = await dbSelectAsync(`SELECT * FROM workspace WHERE id = ${msg.data.workspaceId}`)
      if (result.length === 0) {
        status = 400
        data = 'Workspace not found'
        break
      }
      const workspace = result[0]
      const writefile = util.promisify(fs.writeFile)
      let basepath = msg.data.path.replace(new RegExp('^[/..]+'), '')
      const writepath = `${workspace.path}/${basepath}`
      try {
        await writefile(writepath, msg.data.data)
      } catch (e) {
        status = 400
        data = e.message
      }
      break
    }
    case 'workspace.file.discard': {
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
  global.mainWindow.loadURL(url.format({
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
