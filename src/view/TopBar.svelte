<script lang="ts">
  import Fa from 'svelte-fa'
  import {faPlus} from '@fortawesome/free-solid-svg-icons'

  const handleAddClick = () => {
    alert('add')
  }
</script>
<div class="topbar-main">
  <div class="topbar-logo">
    <h1>Perun</h1>
  </div>
  <div class="topbar-logo-right">
    <button on:click={handleAddClick} class="topbar-add-btn" >
      <Fa icon={faPlus} />
    </button>
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
      width: 100%;
      align-self: center;
      display: flex;
      flex-direction: column;
  }
  .topbar-add-btn {
      align-self: flex-end;
      margin-right: 50px;
  }
</style>
