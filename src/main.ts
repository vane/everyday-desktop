import App from './App.svelte'
import {push} from 'svelte-spa-router'
import {workspaceStore} from './app.store'

// console.log(window.perun.openWebsite('https://duck.com'));
workspaceStore.getAll().then((data: []) => {
	if (data.length === 0) {
		push('/settings')
	}
})

const app = new App({
	target: document.body,
	props: {
		name: 'world',
	}
})

export default app
