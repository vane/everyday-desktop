<script lang="ts">
  import {workspaceStore} from '../../app.store'
  console.log($workspaceStore)
</script>
<div class="workspace-select-main">
  <select class="workspace-select-select">
    {#each $workspaceStore.list as workspace}
      <option value="{workspace.id}" selected="{workspace.status === 1}">{workspace.name}</option>
    {/each}
  </select>
</div>
<style>
  .workspace-select-main {
      text-align: center;
      padding-top: 20px;
  }

  .workspace-select-select {
      max-width: 120px;
  }
</style>
