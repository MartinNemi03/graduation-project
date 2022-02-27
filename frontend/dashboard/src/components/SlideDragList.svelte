<script>
	import SlideCard from './SlideCard.svelte';
	import { dndzone } from 'svelte-dnd-action';

	export let items = [];
	export let onDrop;

	const handleConsider = (e) => {
		items = e.detail.items;
	};

	const handleFinalize = (e) => {
		const { items: nItems } = e.detail;
		if (onDrop) onDrop(nItems);
	};
</script>

<section use:dndzone={{items}} on:consider={handleConsider} on:finalize={handleFinalize}>
	{#each items as item(item.id)}
		<SlideCard item={item}/>
	{/each}
</section>

<style>
	section {
		min-height: 70vh;
	}

	:global(.slide-card) {
		margin: 0 auto;
		margin-bottom: 4px;
	}
</style>