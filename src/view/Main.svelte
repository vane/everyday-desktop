<script lang="ts">
  import Fa from 'svelte-fa'
  import {
    faFolder,
    faFile,
    faArrowLeft,
    faPlus,
    faSave,
  } from '@fortawesome/free-solid-svg-icons'
  import TopBar from './TopBar.svelte'
  import {workspaceStore} from '../app.store'

  interface FilePath {
    name: string,
    isDir: boolean,
    size: number,
  }

  interface FilePathResponse {
    path: string,
    files: FilePath[],
  }

  interface FileDataResponse {
    path: string,
    ext: string,
    data: Uint8Array,
  }

  let currentPath = '/'
  let currentDirList = []
  let currentContent = null
  workspaceStore.subscribe((data) => {
    if (data.selected) {
      handleListDir()
    }
  })
  const handleListPrevDir = () => {
    if (currentPath !== '/') {
      const basepath = currentPath.substring(0, currentPath.length - 1)
      currentPath = currentPath.substring(0, basepath.lastIndexOf('/') + 1)
      handleListDir()
    }
  }
  const handleListDir = () => {
    window.perun.workspaceDirList({
      workspaceId: $workspaceStore.selected.id,
      path: currentPath,
    }, (msg) => {
      const data: FilePathResponse = msg.data
      currentDirList = data.files
    })
  }
  const handleNavigateDir = (fdata: FilePath) => {
    currentPath += `${fdata.name}/`
    handleListDir()
  }
  const handleOpenFile = (fdata: FilePath) => {
    window.perun.workspaceFileRead({
      workspaceId: $workspaceStore.selected.id,
      path: `${currentPath}${fdata.name}`
    }, (msg) => {
      const data: FileDataResponse = msg.data
      currentContent = {
        path: data.path,
        data: new TextDecoder("utf-8").decode(data.data)
      }
    })
  }
  const handleFileSave = (data) => {
    console.log(data)
    data = Object.assign({workspaceId: $workspaceStore.selected.id}, data)
    window.perun.workspaceFileWrite(data, (msg) => {
      console.log(msg)
    })
  }
</script>
<div class="w-100">
  <TopBar />
  <div>
    <button on:click={handleListPrevDir}>
      <Fa icon={faArrowLeft} />
    </button>
    <input value={currentPath}>
    <button on:click={handleListDir}>
      <Fa icon={faPlus} />
    </button>
    <div>
      {#if $workspaceStore.selected}
        <h1>{$workspaceStore.selected.name}</h1>
      {/if}
    </div>
    <div style="display: flex;flex-direction: column; width: 140px;">
      {#each currentDirList as fdata}
        {#if fdata.isDir }
          <button on:click={() => handleNavigateDir(fdata)}>
            <Fa icon={faFolder} /> {fdata.name}
          </button>
        {:else}
          <button on:click={() => handleOpenFile(fdata)}>
            <Fa icon={faFile} /> {fdata.name}
          </button>
        {/if}
      {/each}
    </div>
    <div style="display: flex;flex-direction: column;">
      {#if currentContent}
        <div style="display: flex;flex-direction: row;">
          <h4 style="padding-right: 10px;">{currentContent.path}</h4>
          <button style="align-self: center" on:click={() => handleFileSave(currentContent)}>
            <Fa icon={faSave} />
          </button>
        </div>
        <textarea rows="30" cols="10" bind:value={currentContent.data}></textarea>
      {/if}
    </div>
  </div>
</div>
