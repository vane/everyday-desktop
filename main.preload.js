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
  workspaceAll: (callback) => {
    resp_map[seq] = callback
    const req = new IpcRequest(seq, 'workspace.all', null)
    ipcRenderer.send('perun-request', req)
    seq += 1
  },
})
ipcRenderer.once('perun-reply', (event, arg) => {
	const callback = resp_map[arg.seq]
  if (callback) {
    logger.log('callback invoke', arg)
    callback(arg)
    delete resp_map[seq]
  } else {
    logger.warn('callback empty', arg)
  }
})
