import {writable} from 'svelte/store'


const getAllWorkspaces = (): Promise<[]> => {
  return new Promise((resolve) => {
    window.perun.workspaceAll((msg) => {
      resolve(msg.data)
    })
  })
}

export const workspaceStore = (() => {
  const store = writable([])
  const initialised = false
  let storeData = null
  return {
    subscribe: store.subscribe,
    getAll: async () => {
      if (!initialised) {
        storeData = await getAllWorkspaces()
        store.set(storeData)
      }
      return storeData
    },
    size: () => {
      return store
    }
  }
})()
