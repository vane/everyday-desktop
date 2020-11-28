import {writable} from 'svelte/store'

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
