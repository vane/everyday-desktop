<script lang="ts">
	import { onMount } from 'svelte'
	import Router from 'svelte-spa-router'
	import Menu from './view/Menu.svelte'
	import Main from './view/Main.svelte'
	import Settings from './view/Settings.svelte'

	const routes = {
		'/': Main,
		'/settings': Settings,
	}

	export let url = location.href
	export let name: string

	onMount(() => {
		// Measure pixels per inch
		console.log('Initialized')
	})
</script>
<div class="app-main">
	<div>
		<Menu />
	</div>
	<div class="app-content">
		<Router {routes} />
	</div>
</div>


<style>
	:global(body) {
		margin: 0;
		color: #000000;
		background-color: #f3f3f3;
	}

	.app-main {
		display: flex;
		flex-direction: column;
		flex-grow: 1;
		height: 100%;
	}

	.app-content {
		display: flex;
		height: 100%;
		margin-left: 150px;
	}
</style>
