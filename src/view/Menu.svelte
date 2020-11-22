<script>
  import {link} from 'svelte-spa-router'
</script>
<div>
  <nav class="menu-nav">
    <a href="/" use:link>Home</a>
    <a href="/settings" use:link>Settings</a>
  </nav>
</div>
<style>
  .menu-nav {
    position: fixed;
    min-width: 150px;
    background-color: #f3f3f3;
    color: #000000;
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .menu-nav > :global(a) {
    font-size: 1.7em;
    text-align: center;
    padding: 10px;
  }
</style>
