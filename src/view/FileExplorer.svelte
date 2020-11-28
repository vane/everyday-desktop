<script lang="ts">
  import Fa from 'svelte-fa'
  import {
    faFolder,
    faFile,
    faArrowLeft,
    faPlus,
    faSave,
  } from '@fortawesome/free-solid-svg-icons'
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

  /* Go to previous directory */
  const handleListPrevDir = () => {
    if (currentPath !== '/') {
      const basepath = currentPath.substring(0, currentPath.length - 1)
      currentPath = currentPath.substring(0, basepath.lastIndexOf('/') + 1)
      handleListDir()
    }
  }

  /* Navigate to current directory */
  const handleListDir = () => {
    window.perun.workspaceDirList({
      workspaceId: $workspaceStore.selected.id,
      path: currentPath,
    }, (msg) => {
      const data: FilePathResponse = msg.data
      data.files.sort((a, b) => {
        if (a.isDir && !b.isDir) {
          return -1
        } else if (b.isDir && !a.isDir) {
          return 1
        }
        return 0
      })
      currentDirList = data.files
    })
  }

  /* Change current directory */
  const handleNavigateDir = (fdata: FilePath) => {
    currentPath += `${fdata.name}/`
    handleListDir()
  }

  /* Open file */
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

  /* Save file */
  /*const handleFileSave = (data) => {
    console.log(data)
    data = Object.assign({workspaceId: $workspaceStore.selected.id}, data)
    window.perun.workspaceFileWrite(data, (msg) => {
      console.log(msg)
    })
  }*/

  workspaceStore.subscribe((data) => {
    if (data.selected) {
      currentPath = '/'
      handleListDir()
    }
  })
</script>
<div>
  {#if $workspaceStore.selected}
    <div style="display: flex;flex-direction: row;">
      <button on:click={handleListPrevDir}>
        <Fa icon={faArrowLeft} />
      </button>
      <input value={currentPath} style="max-width: 80px;">
      <button on:click={handleListDir}>
        <Fa icon={faPlus} />
      </button>
    </div>
    <div style="display: flex;flex-direction: column; width: 140px;margin-top: 20px;">
      {#each currentDirList as fdata}
        {#if fdata.isDir }
          <button style="font-size: 1.2em;" on:click={() => handleNavigateDir(fdata)}>
            <Fa icon={faFolder} /> {fdata.name}
          </button>
        {:else}
          <button style="font-size: 1.1em;" on:click={() => handleOpenFile(fdata)}>
            <Fa icon={faFile} /> {fdata.name}
          </button>
        {/if}
      {/each}
      {#if currentDirList.length === 0}
        <span>Empty</span>
      {/if}
    </div>
  {/if}
  <!--<div style="display: flex;flex-direction: column;">
    {#if currentContent}
      <div style="display: flex;flex-direction: row;">
        <h4 style="padding-right: 10px;">{currentContent.path}</h4>
        <button style="align-self: center" on:click={() => handleFileSave(currentContent)}>
          <Fa icon={faSave} />
        </button>
      </div>
      <textarea rows="30" cols="10" bind:value={currentContent.data}></textarea>
    {/if}
  </div>-->
</div>
