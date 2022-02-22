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
		const { items: nItems } = e.detail;
		if (onDrop) onDrop(nItems);
	}
</script>

<section use:dndzone={{items, flipDurationMs}} on:consider={handleConsider} on:finalize={handleFinalize}>
	{#each items as item(item.id)}
		<div id="slide-{item.id}" animate:flip={{ duration: flipDurationMs }}>
			<span>{item.id}</span>
			<table>
				<tr>
					<td><small>Type: </small></td>
					<td>{item.slide.type}</td>
				</tr>
				<tr>
					<td><small>Data: </small></td>
					<td>{JSON.stringify(item.slide.data)}</td>
				</tr>
			</table>
		</div>
	{/each}
</section>

<style>
	section {
		min-height: 70vh;
	}

	div {
		margin: 0 auto;
		margin-bottom: 4px;
		padding: 4px;
		border: 2px solid #000;
		border-radius: 6px;
		background-color: #eee;
		max-width: 400px;
	}

	span {
		float: right;
	}
</style>