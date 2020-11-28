<script lang="ts">
  import Fa from 'svelte-fa'
  import {link} from 'svelte-spa-router'
  import {faCog} from '@fortawesome/free-solid-svg-icons'
</script>
<div class="topbar-main">
  <div style="width: 100%;height: 100%;display: flex;padding-left: 20px;">
    <input style="width: 100%;align-self: center; font-size: 1.4em;" placeholder="Search">
  </div>
  <div class="topbar-logo-right">
    <a href="/settings" use:link class="topbar-settings-btn">
      <Fa icon={faCog} />
    </a>
  </div>
</div>
<style>
  .topbar-main {
      display: flex;
      flex-direction: row;
      height: 50px;
      width: 100%;
      background-color: white;
  }
  .topbar-logo {
      align-self: center;
      width: 100%;
      padding-left: 20px;
  }

  .topbar-logo-right {
      padding-left: 20px;
      align-self: center;
      display: flex;
      flex-direction: column;
  }
  .topbar-settings-btn {
      align-self: flex-end;
      margin-right: 50px;
  }
</style>
