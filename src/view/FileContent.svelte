<script lang="ts">
  import {openedFileStore} from '../app.store'
  import * as monaco from 'monaco-editor'

  openedFileStore.subscribe((content) => {
    if (content) {
      const el = document.getElementById('file-content')
      el.innerHTML = ''
      if (content.fileType === 4) {
        el.innerHTML = `<img style="object-fit: contain;max-width: 100%;max-height: 100%;width: auto;height: auto;" src="data:image/png;base64,${content.fileData}">`
        //image.src = `data:image/png;base64,${imgSrc}`
        // el.appendChild(image)
      } else if (content.fileType === 1) {
        const value = new TextDecoder("utf-8").decode(content.fileData)
        monaco.editor.create(el, {
          value: value,
          language: 'python'
        })
      } else {
        const pre = document.createElement('pre')
        pre.innerText = new TextDecoder("utf-8").decode(content.fileData)
        el.appendChild(pre)
      }
    }
  })
</script>
<div id="file-content" class="file-content">
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
