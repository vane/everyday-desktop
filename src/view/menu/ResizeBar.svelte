<script lang="ts">
  import { createEventDispatcher } from 'svelte';
	import {menuWidthStore} from '../../app.store'

  const dispatch = createEventDispatcher();

  let pointDown = null
	let oldWidth = null

  const handleMouseDown = (e: MouseEvent) => {
  	console.log('Resize old size : ', $menuWidthStore)
		pointDown = {x: e.clientX, y: e.clientY}
		document.addEventListener('mouseup', handleMouseUp)
		document.addEventListener('mousemove', handleMouseMove)
		oldWidth = $menuWidthStore
	}

	const handleMouseMove = (e: MouseEvent) => {
  	if (pointDown) {
			menuWidthStore.update((w)=> oldWidth - (pointDown.x - e.clientX))
		}
	}

	const handleMouseUp = () => {
  	pointDown = null
		console.log(`Resize new size : ${$menuWidthStore}`)
		document.removeEventListener('mouseup', handleMouseUp)
		document.removeEventListener('mousemove', handleMouseMove)
	}
</script>
<div
		style="width: 4px;height: 100vh;background-color: #000000;cursor: col-resize;"
		on:mousedown={handleMouseDown}
		on:rele
    on:mousemove={handleMouseMove}>
</div>
