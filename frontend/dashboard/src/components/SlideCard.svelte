<script>
    import { onMount, onDestroy } from 'svelte';

    export let item = {};
    export let onStatusChange = (status) => {};

    let status = "waiting";
    let displayFooter = false;
    let footerText = "";
    let interval;

    const changeStatus = (newStatus) => {
        if (status === newStatus) return;
        status = newStatus;
        onStatusChange(status);
    };

    const resetFooter = () => {
        footerText = "";
        displayFooter = false;
    };

    const updateFooter = () => {
        if (!item?.queued_timestamp) return resetFooter();
        let from = Math.floor((Date.now() - item?.queued_timestamp) / 1000);
        let to = Math.floor((item?.queued_timestamp - Date.now()) / 1000);

        if (from >= 60) 
            if (status !== "already_displayed")
                changeStatus("already_displayed");

        if (to <= 0 && from >= 60) 
            return resetFooter();

        if (to >= 0) {
            if (status != "upcoming") changeStatus("upcoming");
            footerText = `Upcoming in <b>${to}s</b>`;
        } else if (from >= 0 && from <= 60) {
            if (status != "displaying") changeStatus("displaying");
            footerText = `Displaying for <b>${(item.duration - from)}s</b>`;
        }

        displayFooter = true;
    };

    onMount(() => {
        updateFooter();
        interval = setInterval(updateFooter, 250);
    });

    onDestroy(() => {
        if (interval) clearInterval(interval);
        resetFooter();
    });
</script>

<div id="slide-{item.id}" class="slide-card card border-{item.error ? 'danger' : 'dark'}">
    <div class="card-body">
        <span class="card-subtitle text-muted slide-id">{item.id}</span>
        <table>
            <tr>
                <th><small>Type:</small></th>
                <td>{item.slide.type}</td>
            </tr>
            <tr>
                <th><small>Data:</small></th>
                <td>{JSON.stringify(item.slide.data)}</td>
            </tr>
            {#if item.duration}
                <tr>
                    <th><small>Duration:</small></th>
                    <td>{item.duration}s</td>
                </tr>
            {/if}
        </table>
    </div>

    {#if displayFooter}
        <div class="card-footer">
            <span class="text-muted">{@html footerText}</span>
        </div>
    {/if}
</div>

<style>
    .slide-id {
		float: right;
	}

    .slide-card {
        overflow: hidden;
    }

    th {
        text-align: right;
        padding-right: 6px;
    }
</style>

