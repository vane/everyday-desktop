<script lang="ts">
  import WorkspaceSelect from './workspace/WorkspaceSelect.svelte'
  import TimeDisplay from './menu/TimeDisplay.svelte'
  import FileExplorer from './FileExplorer.svelte'
  import {menuWidthStore} from '../app.store'
</script>
<div class="menu-nav" style={`min-width:${$menuWidthStore}px`}>
  <div style="text-align: center;padding-top:10px;">
    <span style="font-size: 1.7em;">Perun</span>
  </div>
  <div>
    <TimeDisplay />
    <div style="padding-bottom: 20px;">
      <WorkspaceSelect />
    </div>
    <div style="display: flex;justify-content: center;width: 100%;">
      <FileExplorer />
    </div>
  </div>
</div>
<style>
  .menu-nav {
    height: 100vh;
    background-color: #ffffff;
    color: #000000;
    display: flex;
    flex-direction: column;
  }
</style>
