<script lang="ts">
  import {workspaceStore} from '../../app.store'

  let selectedWorkspace
  workspaceStore.subscribe((data) => {
    selectedWorkspace = data.selected
  })

  const handleWorkspaceChange = async (data) => {
    await workspaceStore.select(selectedWorkspace)
  }
</script>
<div class="workspace-select-main">
  {#if $workspaceStore.list.length > 0}
    <select class="workspace-select-select"
            bind:value={selectedWorkspace}
            on:change={handleWorkspaceChange}>
      {#each $workspaceStore.list as workspace}
        <option value="{workspace}">{workspace.name}</option>
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
