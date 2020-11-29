<script lang="ts">
	import {onMount} from 'svelte'
	import Router from 'svelte-spa-router'
	import Menu from './view/Menu.svelte'
	import Main from './view/Main.svelte'
	import Settings from './view/Settings.svelte'
	import ResizeBar from './view/menu/ResizeBar.svelte'

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
	<Menu />
	<ResizeBar />
	<div class="app-content">
		<Router {routes} style="margin: 0; padding: 0;" />
	</div>
</div>


<style>
	:global(body) {
		margin: 0;
		color: #000000;
		background-color: #f3f3f3;
		height: 100%;
		width: 100%;
	}

	.app-main {
		display: flex;
		flex-direction: row;
		flex-grow: 1;
		height: 100%;
	}

	.app-content {
		display: flex;
		height: 100%;
		width: 100%;
		flex-grow: 1;
	}
</style>
