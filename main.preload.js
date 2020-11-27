const { contextBridge, ipcRenderer } = require('electron')
const { logger } = require('./perun/log')

let seq = 1
let resp_map = {}
class IpcRequest {
  constructor (seq, name, data) {
    this.seq = seq
    this.name = name
		this.data = data
  }
}
contextBridge.exposeInMainWorld('perun', {
  openWebsite: (url) => {
    const req = new IpcRequest('open.website', url)
    ipcRenderer.send('perun-request', req)
  },
  /* Workspace */
  workspaceList: (callback) => {
    resp_map[seq] = callback
    const req = new IpcRequest(seq, 'workspace.list', null)
    ipcRenderer.send('perun-request', req)
    seq += 1
  },
  workspaceDirSelect: (data, callback) => {
    resp_map[seq] = callback
    const req = new IpcRequest(seq, 'workspace.dir.select', data)
    ipcRenderer.send('perun-request', req)
    seq += 1
  },
  workspaceDirList: (data, callback) => {
    resp_map[seq] = callback
    const req = new IpcRequest(seq, 'workspace.dir.list', data)
    ipcRenderer.send('perun-request', req)
    seq += 1
  },
  workspaceFileRead: (data, callback) => {
    resp_map[seq] = callback
    const req = new IpcRequest(seq, 'workspace.file.read', data)
    ipcRenderer.send('perun-request', req)
    seq += 1
  },
  workspaceFileWrite: (data, callback) => {
    resp_map[seq] = callback
    const req = new IpcRequest(seq, 'workspace.file.write', data)
    ipcRenderer.send('perun-request', req)
    seq += 1
  },
  workspaceFileDiscard: (data, callback) => {
    resp_map[seq] = callback
    const req = new IpcRequest(seq, 'workspace.file.discard', data)
    ipcRenderer.send('perun-request', req)
    seq += 1
  }
})
ipcRenderer.on('perun-reply', (event, arg) => {
	const callback = resp_map[arg.seq]
  if (callback) {
    logger.log('callback invoke', arg)
    callback(arg)
    delete resp_map[seq]
  } else {
    logger.warn('callback empty', arg)
  }
})
