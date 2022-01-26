<script>
	import { dndzone } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';
	const flipDurationMs = 100;
	
	export let items = [];
	
	function handleSort(e) {
		items = e.detail.items;
	}
</script>

<section use:dndzone={{items, flipDurationMs}} on:consider={handleSort} on:finalize={handleSort}>
	{#each items as item(item._id)}
		<div animate:flip={{ duration: flipDurationMs }}>
			{item.title}	
		</div>
	{/each}
</section>

<style>
    
</style>