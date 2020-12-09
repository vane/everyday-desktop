const fs = require('fs')
const path = require('path')
const util = require('util')
const {dbSelectAsync, dbModifyAsync} = require('../db')
const { fileDirOpen } = require('../file.open')
const { isKnownFileType, FileExtension } = require('../file.extension')
const { PerunError } = require('../error')
const { SIZE_1MB } = require('../config')
const { logger } = require('../log')

/**
 * List all workspaces
 */
exports.workspaceList = async () => {
  return await dbSelectAsync('SELECT * from workspace')
}

/**
 * Select workspace
 */
exports.workspaceSelect = async (workspaceId) => {
  await dbModifyAsync(`
    UPDATE workspace 
      SET status = 1 
    WHERE id = ${workspaceId}
  `)
  await dbModifyAsync(`
    UPDATE workspace 
      SET status = 0 
    WHERE status = 1 AND id != ${workspaceId}
  `)
}

/**
 * Add workspace
 */
exports.workspaceAdd = async ({workspaceName}) => {
  const selectedDir = await fileDirOpen()
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
  return {
    id: result.lastID,
    name: workspaceName,
    path: selectedDir,
    status: 1,
  }
}

/**
 * Remove workspace
 */
exports.workspaceRemove = async ({workspaceId}) => {
  return workspaceId
}

/**
 * List workspace directory
 */
exports.workspaceDirList = async ({workspaceId, path}) => {
  const result = await dbSelectAsync(`SELECT * FROM workspace WHERE id = ${workspaceId}`)
  if (result.length === 0) {
    throw new PerunError('Workspace not found', 400)
  }
  const workspace = result[0]
  const readdir = util.promisify(fs.readdir)
  const stat = util.promisify(fs.stat)

  // Let's trim this cause user can go to other dir using /../../
  let basepath = '/'+path.replace(new RegExp('^[/..]+'), '')
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
  return {
    path: basepath,
    files: files,
  }
}

const getFilepath = async ({basepath, workspaceId}) => {
  const result = await dbSelectAsync(`SELECT * FROM workspace WHERE id = ${workspaceId}`)
  if (result.length === 0) {
    throw new PerunError('Workspace not found', 400)
  }
  const workspace = result[0]
  // check for .. and replace
  if (basepath.indexOf('..') !== -1) {
    basepath = basepath.replace(new RegExp('^[/..]+'), '')
  }
  return `${workspace.path}/${basepath}`
}

/**
 * Read workspace file
 */
exports.workspaceFileRead = async ({path:basepath, start, end, workspaceId}) => {
  const fpath = await getFilepath({basepath, workspaceId})

  const stat = util.promisify(fs.stat)
  const fstat = await stat(fpath)

  // Determine file type
  const ext = path.extname(fpath)
  const fileType = isKnownFileType(ext)

  // Check if asking out of range
  if (start > fstat.size) {
    throw new PerunError('Range Not Satisfiable', 416)
  }
  // Adjust end - TODO maybe check for end above
  end =  Math.min(end, fstat.size)

  // TODO change - for now all images start - end is full size
  if (fileType === FileExtension.Image) {
    start = 0
    end = fstat.size
  }

  // calculate in MB
  const sizeMB = Math.round(fstat.size/SIZE_1MB)
  logger.debug(`File size : ${sizeMB}MB`)

  // Read file
  let fdata = Buffer.alloc(0)
  const fsStream = fs.createReadStream(fpath, {
    start: start,
    end: end
  })
  for await (const chunk of fsStream) {
    fdata = Buffer.concat([fdata, chunk])
  }
  fdata = fdata.toString('base64')
  // Create response
  return {
    path: basepath,
    fileType: fileType,
    fileSize: fstat.size,
    ext: ext,
    fileData: {
      start: start,
      end: end,
      data: fdata
    },
  }
}

/**
 * Write workspace file
 */
exports.workspaceFileWrite = async ({workspaceId, path:basepath, data}) => {
  const fpath = await getFilepath({basepath, workspaceId})
  // END
  const writefile = util.promisify(fs.writeFile)
  await writefile(fpath, data.data)
}
