<script lang="ts">
  import { workspaceStore } from '../app.store'

  const handleAddWorkspace = () => {
    window.perun.workspaceDirSelect({
      title: 'Select workspace directory',
    }, (msg) => {
      console.log('add directory response', msg)
      if (msg.status === 200) {
        workspaceStore.getAll()
      }
    })
  }
</script>
<div>
  <h1>Settings</h1>
  <div>
    <div>
      <h3>Workspace</h3>
      <button on:click={handleAddWorkspace}>New</button>
    </div>
  </div>
</div>
