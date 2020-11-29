<script lang="ts">
  import {openedFileStore} from '../app.store'

  let fileContent = ''

  openedFileStore.subscribe((content) => {
    if (content) {
      fileContent = new TextDecoder("utf-8").decode(content.fileData)
    }
  })
</script>
<div class="file-content">
  <pre>
    {fileContent}
  </pre>
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
