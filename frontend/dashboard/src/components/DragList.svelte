<script>
	import { dndzone } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';
	const flipDurationMs = 100;
	
	export let items = [];
	export let onDrop;
	
	function handleConsider(e) {
		items = e.detail.items;
	}

	function handleFinalize(e) {
		const { items: newItems } = e.detail;
		if (onDrop) onDrop(newItems);
	}
</script>

<section use:dndzone={{items, flipDurationMs}} on:consider={handleConsider} on:finalize={handleFinalize}>
	{#each items as item(item.id)}
		<div animate:flip={{ duration: flipDurationMs }}>
			{item.id}
		</div>
	{/each}
</section>

<style>
	section {
		min-height: 200px;
	}
</style>