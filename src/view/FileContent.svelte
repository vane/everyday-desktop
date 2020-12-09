<script lang="ts">
  import type {FileContent, FileType} from '../app.store'
  import {FileType, menuWidthStore, openedFileStore, workspaceFileRead, workspaceStore} from '../app.store'
  // import * as monaco from 'monaco-editor'
  let fileContentDiv
  let fileContent: FileContent
  let isLoading = false

  menuWidthStore.subscribe((data) => {
    const el = document.getElementById('file-content')
    if (el && data) {
      el.style.width = `calc(100vw - ${data+10}px)`
    }
  })

  openedFileStore.subscribe((content: FileContent) => {
    console.log(content)
    if (content) {
      if (content.path !== fileContent?.path) {
        console.log('reset !!!!!!!!!!!')
        fileContentDiv.scrollTop = 0
        fileContentDiv.textContent = ''
        fileContent = content
        if (fileContent.fileType === FileType.Image) {
          fileContentDiv.innerHTML = `<img style="object-fit: contain;max-width: 100%;max-height: 100%;width: auto;height: auto;" src="data:image/png;base64,${content.fileData.data}">`
        } /* Code editing disabled for now due to compilation times
        else if (content.fileType === 1) {
          const value = atob(content.fileData)
          monaco.editor.create(el, {
            value: value,
            language: 'python'
          })
        }*/ else {
          const pre = document.createElement('pre')
          fileContentDiv.appendChild(pre)
          pre.innerText = fileContent.fileData.data
          console.log('file content loaded ok !')
        }
      } else {
        fileContent = content
      }
    }
  })
  const handleScroll = async () => {
    const scrollPosition = fileContentDiv.scrollHeight - fileContentDiv.offsetHeight
    if (!isLoading
      &&fileContent
      && fileContent.fileData.end < fileContent.fileSize
      && fileContent.fileType !== FileType.Image
      && fileContentDiv.scrollTop === scrollPosition) {
      isLoading = true
      const data = await workspaceFileRead({
        workspaceId: $workspaceStore.selected.id,
        path: fileContent.path,
        start: fileContent.fileData.end,
        end: Math.min(fileContent.fileData.end + 10000, fileContent.fileSize),
      }, true)
      console.log('file content append')
      const pre = fileContentDiv.firstChild
      console.log(pre, data)
      pre.innerText += data.fileData.data
      isLoading = false
      console.log('file content append ok !')
    }
  }
</script>
<div bind:this={fileContentDiv} class="file-content" on:wheel={handleScroll}>
</div>
<style>
  .file-content {
      display: flex;
      flex-grow: 1;
      width: calc(100vw - 160px);
      height: calc(100vh - 56px);
      overflow: auto;
      /*border-style: solid;
      border-color: red;*/
  }
</style>
