<script>
    export let item = {};
</script>

<div id="display-{item.id}" class="display-card card">
    <div class="card-body">
        <span class="card-subtitle text-muted slide-id">{item.id}</span>
        <table>
            <tr>
                <th><small>IP:</small></th>
                <td>{item.data.ip}</td>
            </tr>
            <tr>
                <th><small>User Agent:</small></th>
                <td>{item.data.user_agent}</td>
            </tr>
        </table>
    </div>

    <div class="card-footer">
        <span class="text-muted">Connected since {new Date(item.data.join_timestamp).toLocaleString('cs-CZ')}</span>
    </div>
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