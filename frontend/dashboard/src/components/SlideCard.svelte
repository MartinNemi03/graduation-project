<script>
    export let item = {};

    let displayFooter = false;
    let footerText = "";

    const updateFooter = () => {
        let from = Math.floor((Date.now() - item?.queued_timestamp) / 1000);
        let to = Math.floor((item?.queued_timestamp - Date.now()) / 1000);

        if (to <= 0 && from >= 60) {
            displayFooter = false;
            return;
        }

        if (to >= 0)
            footerText = `Upcoming in <b>${to}s</b>`;
        else if (from >= 0 && from <= 60)
            footerText = `Displayed for <b>${(item.duration - from)}s</b>`;

        displayFooter = true;
        setTimeout(updateFooter, 250);
    };

    if (item?.queued_timestamp)
        updateFooter();
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

    th {
        text-align: right;
        padding-right: 6px;
    }
</style>

