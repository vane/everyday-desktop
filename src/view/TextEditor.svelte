<script lang="ts">
  import marked from 'marked'

  let textValue = `Some words are *italic*, some are **bold**`
</script>
<div style="display: flex;flex-direction: row;flex-grow: 1;justify-content: space-between;">
  <textarea style="min-width: 50%;height: 200px;align-items: stretch;border-style: none; outline: none;"
    bind:value={textValue}></textarea>
  <div style="width: 100%;height: 200px;overflow: auto;">
    {@html marked(textValue)}
  </div>
</div>
<style>
</style>
