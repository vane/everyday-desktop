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

	const handleResizeDown = () => {
		console.log('Resize', e)
	}
</script>
<div class="app-main">
	<Menu />
	<div
		style="width: 4px;height: 100vh;background-color: #000000;cursor: col-resize;"
		on:mousedown={handleResizeDown}></div>
	<div class="app-content">
		<Router {routes} />
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
