<script lang="ts">
  import {workspaceStore} from '../../app.store'
  console.log($workspaceStore)
</script>
<div class="workspace-select-main">
  {#if $workspaceStore.list.length > 0}
    <select class="workspace-select-select">
      {#each $workspaceStore.list as workspace}
        <option value="{workspace.id}" selected="{workspace.status === 1}">{workspace.name}</option>
      {/each}
    </select>
  {/if}
</div>
<style>
  .workspace-select-main {
      text-align: center;
      padding-top: 20px;
  }

  .workspace-select-select {
      max-width: 140px;
  }
</style>
