<script lang="ts">
  import Fa from 'svelte-fa'
  import {faHome} from '@fortawesome/free-solid-svg-icons'
  import { workspaceStore } from '../app.store'

  let newWorkspaceName = ''

  const handleAddWorkspace = () => {
    window.perun.workspaceAdd({
      title: 'Select workspace directory',
      workspaceName: newWorkspaceName,
    }, (msg) => {
      console.log('Add workspace response', msg)
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
      {#if $workspaceStore.list.length > 0}
        <a href="#">
          <Fa icon={faHome} />
        </a>
      {/if}
      <div>
        <input bind:value={newWorkspaceName} placeholder="name" />
        <button on:click={handleAddWorkspace}>New</button>
      </div>
      <div>
        {#each $workspaceStore.list as workspace}
          <div>
            <h3>{workspace.id}</h3>
            <p>{workspace.name}</p>
            <p>{workspace.path}</p>
            <p>{workspace.status}</p>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>
