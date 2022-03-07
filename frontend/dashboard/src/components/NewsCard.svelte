<script>
    export let item = {};
    export let onDelete;
</script>

<div id="news-{item.id}" class="news-card card border-dark">
    <div class="card-body">
        <span class="card-subtitle">
            <button type="button" class="btn btn-sm btn-danger" on:click={onDelete(item.id)}><i class="bi bi-x-lg"></i></button>
        </span>
        <table>
        {#if item?.raw}
            <tr>
                <th><small>Raw:</small></th>
                <td>{item.raw}</td>
            </tr>
        {/if}

        {#if item?.parsed}
            <tr>
                <th><small>Parsed:</small></th>
                <td>{item.parsed}</td>
            </tr>
        {/if}
        </table>
    </div>
</div>

<style>
    .card-subtitle {
		float: right;
	}

    th {
        text-align: right;
        padding-right: 6px;
    }
</style>