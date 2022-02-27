<script>
    import { onMount } from 'svelte';

    export let timestamp = 0;
    export let onRefresh = () => {};

    const refresh = () => {
        timestamp = Date.now();
        onRefresh();
    };

    let refreshToggle = true;
    let refreshTimer = 15;
    let untilRefresh = refreshTimer;

    const updateRefresh = () => {
        if (!refreshToggle || timestamp <= 0) return;
        let fromReady = Math.floor((Date.now() - timestamp) / 1000);

        if (fromReady >= refreshTimer) refresh();
        else { 
            untilRefresh = Math.floor(refreshTimer - fromReady); 
            setTimeout(updateRefresh, 100);
        }
    };

    const setRefreshTimer = (seconds = 0, toggle = true) => {
        refreshToggle = toggle;
        refreshTimer = seconds;

        if (refreshToggle)
            timestamp = Date.now();
    };

    onMount(() => {
        updateRefresh();
    });
</script>

<div class="refresh">
    <div class="refresh-wrapper btn-group" role="group">
        <button type="button" class="btn btn-outline-dark btn-refresh" on:click={refresh}>Refresh{refreshToggle ? ` (${untilRefresh}s)` : ""}</button>
        <div class="btn-group" role="group">
            <button id="timer-dropdown" type="button" class="btn btn-outline-dark dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                {refreshToggle ? `${refreshTimer}s` : "Off"}
            </button>
            <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="timer-dropdown">
                <li><button class="dropdown-item" on:click={() => setRefreshTimer(0, false)}>Off</button></li>
                <li><button class="dropdown-item" on:click={() => setRefreshTimer(15)}>15s</button></li>
                <li><button class="dropdown-item" on:click={() => setRefreshTimer(30)}>30s</button></li>
                <li><button class="dropdown-item" on:click={() => setRefreshTimer(60)}>60s</button></li>
            </ul>
        </div>
    </div>
</div>

<style>
    .refresh {
        position: fixed;
        top: 70px;
        left: 50%;
        z-index: 10;
    }

    .refresh-wrapper {
        position: relative;
        left: -50%;
    }
</style>