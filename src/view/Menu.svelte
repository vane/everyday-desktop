<script lang="ts">
  import Fa from 'svelte-fa'
  import {faCog, faHome} from '@fortawesome/free-solid-svg-icons'
  import {link} from 'svelte-spa-router'
  import WorkspaceSelect from './workspace/WorkspaceSelect.svelte'
  import TimeDisplay from './menu/TimeDisplay.svelte'
  import FileExplorer from './FileExplorer.svelte'
</script>
<div class="menu-nav">
  <div>
    <TimeDisplay />
    <WorkspaceSelect />
    <div class="menu-link">
      <a href="/" use:link>
        <Fa icon={faHome} />
      </a>
    </div>
    <div style="text-align: center;">
      <FileExplorer />
    </div>
  </div>
  <div class="menu-link">
    <a href="/settings" use:link>
      <Fa icon={faCog} />
    </a>
  </div>
</div>
<style>
  .menu-nav {
    height: 100vh;
    min-width: 150px;
    background-color: #ffffff;
    color: #000000;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .menu-link {
    font-size: 1em;
    text-align: center;
    padding: 10px;
  }
</style>
