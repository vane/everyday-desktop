import {writable} from 'svelte/store'

declare global {
    interface Window {
      perun: any,
    }
}

/* Workspace */
enum WorkspaceStatus {
  Inactive,
  Active
}

interface WorkspaceVO {
  id: number,
  name: string,
  path: string,
  status: number
}

interface WorkspaceData {
  selected?: WorkspaceVO,
  list: WorkspaceVO[],
}

const getAllWorkspaces = (): Promise<WorkspaceVO[]> => {
  return new Promise((resolve) => {
    window.perun.workspaceList((msg) => {
      resolve(msg.data)
    })
  })
}

const selectWorkspace = (workspace: WorkspaceVO): Promise<boolean> => {
  return new Promise((resolve) => {
    window.perun.workspaceSelect({
      workspaceId: workspace.id,
    }, (msg) => {
      resolve(true)
    })
  })
}

const findFirstStatus = (list:WorkspaceVO[], status: number): WorkspaceVO => {
  for (const el of list) {
    if (el.status === status) return el
  }
  return null
}

export const workspaceStore = (() => {
  const store = writable<WorkspaceData>({
    list: [],
    selected: null,
  })
  let storeData = null
  let selected = null
  return {
    subscribe: store.subscribe,
    getAll: async () => {
      storeData = await getAllWorkspaces()
      selected = findFirstStatus(storeData, WorkspaceStatus.Active)
      store.set({
        list: storeData,
        selected: selected,
      })
      return storeData
    },
    select: async (workspace) => {
      await selectWorkspace(workspace)
      selected = workspace
      store.set({
        list: storeData,
        selected: selected
      })
    }
  }
})()

/* Menu width */
export const menuWidthStore = writable<number>(150)

/* File */

export enum FileType {
  Unknown,
  SourceCode,
  PlainText,
  MarkDown,
  Image,
  Video
}

export interface FileData {
  start: number,
  end: number,
  data: string
}

export interface FileContent {
  path: string,
  fileType: FileType,
  fileSize: number,
  ext: string,
  fileData: FileData,

}

export interface FileRead {
  workspaceId: number,
  path: string,
  start: number,
  end: number,
}

interface FilePath {
  name: string,
  isDir: boolean,
  size: number,
}

interface FilePathResponse {
  path: string,
  files: FilePath[],
}

export interface WorkspaceFilePath {
  workspaceId: number,
  path: string,
}
export const openedFileStore = writable<FileContent>(null)

export function workspaceDirectoryList(data: WorkspaceFilePath): Promise<FilePath[]> {
  return new Promise(resolve => {
    window.perun.workspaceDirList(data, (msg) => {
      const data: FilePathResponse = msg.data
      data.files.sort((a, b) => {
        if (a.isDir && !b.isDir) {
          return -1
        } else if (b.isDir && !a.isDir) {
          return 1
        }
        return 0
      })
      resolve(data.files)
    })
  })
}

export function workspaceFileRead(data: FileRead, update = false): Promise<FileContent> {
  return new Promise(resolve => {
    window.perun.workspaceFileRead(data, (msg) => {
      if (msg.status === 200) {
        const content: FileContent = msg.data
        if (!update) {
          if (content.fileType !== FileType.Image) {
            content.fileData.data = atob(content.fileData.data)
          }
          openedFileStore.set(msg.data)
          resolve(msg.data)
        } else {
          openedFileStore.update((current) => {
            if (current.fileData.end !== content.fileData.end) {
              current.fileData.end = content.fileData.end
              content.fileData.data = atob(content.fileData.data)
              current.fileData.data += content.fileData.data
            }
            resolve(msg.data)
            return current
          })
        }
      } else {
        alert(msg.data)
        resolve(msg.data)
      }
    })
  })
}

/* TimeState*/
export const timeStatStore = writable<string>('')
