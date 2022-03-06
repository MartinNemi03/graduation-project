<script>
    import { onDestroy, onMount } from 'svelte';

    export let timestamp = 0;
    export let onRefresh = () => {};
    export let timerSeconds = [15, 30, 60];
    export let defaultTimer = 15;

    const refresh = () => {
        timestamp = Date.now();
        onRefresh();
    };

    let refreshToggle = (defaultTimer > 0) ? true : false;
    let refreshTimer = defaultTimer;
    let untilRefresh = refreshTimer;
    let timeout;

    const updateRefresh = () => {
        if (!refreshToggle || timestamp <= 0) return;
        let fromReady = Math.floor((Date.now() - timestamp) / 1000);

        if (fromReady >= refreshTimer) refresh();
        else {
            untilRefresh = Math.floor(refreshTimer - fromReady);
            timeout = setTimeout(updateRefresh, 100);
        }
    };

    const setRefreshTimer = (seconds = 0, toggle = true) => {
        refreshToggle = toggle;
        refreshTimer = seconds;

        if (refreshToggle) {
            timestamp = Date.now();
            updateRefresh();
        } else if (timeout) clearTimeout(timeout);
    };

    onMount(() => {
        if (refreshToggle)
            updateRefresh();
    });

    onDestroy(() => {
        if (timeout) clearTimeout(timeout);
    });
</script>

<div class="refresh">
    <div class="refresh-wrapper btn-group" role="group">
        <button type="button" class="btn btn-outline-dark btn-refresh" on:click={refresh}>Refresh{refreshToggle ? ` (${untilRefresh}s)` : ""}</button>
        {#if timerSeconds.length > 0}
            <div class="btn-group" role="group">
                <button id="timer-dropdown" type="button" class="btn btn-outline-dark dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                    {refreshToggle ? `${refreshTimer}s` : "Off"}
                </button>
                <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="timer-dropdown">
                    <li><button class="dropdown-item" on:click={() => setRefreshTimer(0, false)}>Off</button></li>
                    {#each timerSeconds as seconds}
                        <li><button class="dropdown-item" on:click={() => setRefreshTimer(seconds)}>{seconds}s</button></li>
                    {/each}
                </ul>
            </div>
        {/if}
    </div>
</div>

<style>
    .refresh {
        position: fixed;
        top: 76px;
        left: 50%;
        z-index: 10;
    }

    .refresh-wrapper {
        position: relative;
        left: -50%;
    }
</style>