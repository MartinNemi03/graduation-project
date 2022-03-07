<script>
	import NewsCard from './NewsCard.svelte';
	import { dndzone } from 'svelte-dnd-action';

	export let items = [];
	export let onDrop;
    export let onDelete;

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
		<NewsCard item={item} onDelete={onDelete}/>
	{/each}
</section>

<style>
	section {
		min-height: 200px;
	}

	:global(.news-card) {
		margin: 0 auto;
		margin-bottom: 4px;
	}
</style>