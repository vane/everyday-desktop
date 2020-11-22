import App from './App.svelte'
import {push} from 'svelte-spa-router'

// console.log(window.perun.openWebsite('https://duck.com'));
window.perun.workspaceAll((msg) => {
	if (msg.data.length === 0) {
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
