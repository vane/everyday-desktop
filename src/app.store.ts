import {writable} from 'svelte/store'

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
  const initialised = false
  let storeData = null
  return {
    subscribe: store.subscribe,
    getAll: async () => {
      if (!initialised) {
        storeData = await getAllWorkspaces()
        const selected = findFirstStatus(storeData, WorkspaceStatus.Active)
        store.set({
          list: storeData,
          selected: selected,
        })
      }
      return storeData
    },
  }
})()
