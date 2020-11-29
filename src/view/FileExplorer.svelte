<script lang="ts">
  import Fa from 'svelte-fa'
  import {
    faFolder,
    faFile,
    faArrowLeft,
    faPlus,
    faSave,
  } from '@fortawesome/free-solid-svg-icons'
  import {openedFileStore, timeStatStore, workspaceStore} from '../app.store'

  interface FilePath {
    name: string,
    isDir: boolean,
    size: number,
  }

  interface FilePathResponse {
    path: string,
    files: FilePath[],
  }

  let currentPath = '/'
  let currentDirList = []

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
    console.log('Open file')
    window.perun.workspaceFileRead({
      workspaceId: $workspaceStore.selected.id,
      path: `${currentPath}${fdata.name}`
    }, (msg) => {
      if (msg.status === 200) {
        openedFileStore.update(() => msg.data)
      } else {
        alert(msg.data)
      }
      /*currentContent = {
        path: data.path,
        data: txt
      }*/
    })
  }

  const handlePathKeyUp = (e) => {
    if (e.keyCode === 13) {
      console.log(currentPath)
      handleListDir()
    }
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

  let isAdvanced = false
  timeStatStore.subscribe((data) => {
    if (data === 'ADVANCED') {
      isAdvanced = true
    } else {
      isAdvanced = false
    }
    console.log('timeStatStore', data)
  })
</script>
<div>
  {#if $workspaceStore.selected}
    <div style="display: flex;flex-direction: row;">
      <button on:click={handleListPrevDir}>
        <Fa icon={faArrowLeft} />
      </button>
      <input bind:value={currentPath} style="max-width: 80px;" on:keyup={handlePathKeyUp}>
      <button on:click={handleListDir}>
        <Fa icon={faPlus} />
      </button>
    </div>
    <div class="file-list" class:advanced={isAdvanced} class:basic={!isAdvanced}>
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
<style>
  .advanced {
      height: calc(100vh - 204px);
  }
  .basic {
      height: calc(100vh - 187px);
  }
  .file-list {
      display: flex;
      flex-direction: column;
      width: 140px;
      margin-top: 20px;
      overflow-y: auto;
      overflow-x: hidden;
  }
</style>
