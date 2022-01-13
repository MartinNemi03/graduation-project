<script>
    const form = {
        type: "",
        data: {}
    };

    let data = [
        {
            key: "",
            value: ""
        }
    ];

    const availableTypes = [
        "video"
    ];

    const addData = (key = "", value = "") => {
        if (!(key instanceof String)) key = "";
        data = data.concat({ key, value });
    };

    const removeData = (index) => {
        data.splice(index, 1);
        data = data;
    };

    const updateData = () => {
        form.data = {};
        data.forEach(item => {
            if (item.key != "" && item.key != null) 
                form.data[item.key] = item.value; 
        });
    };

    const submitForm = async () => {
        console.log(JSON.stringify(form));

        const req = await fetch('../../api/slides/add', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(form)
        });

        console.log(req.json());
    };
</script>

<div id="content">
    <form>
        <p>
            { JSON.stringify(form) }<br>
            { JSON.stringify(data) }
        </p>

        <small>Type:</small><br>
        <select name="type" id="slide-type" bind:value={form.type}>
            <option value="">Custom</option>
            {#each availableTypes as type}
                <option value="{type}">{type}</option>
            {/each}
        </select>
        {#if !availableTypes.includes(form.type)}
            <input type="text" name="actual-type" id="slide-actual-type" bind:value={form.type}>
        {/if}
        <br><small>Data:</small><br>
        {#each data as item, i}
            <input type="text" name="data-key-{i}" id="data-key-{i}" on:change={updateData} bind:value={data[i].key}>
            <input type="text" name="data-value-{i}" id="data-value-{i}" on:change={updateData} bind:value={data[i].value}>
            <button type="button" on:click={addData}> + </button>
            {#if i > 0}
                <button type="button" on:click={() => { removeData(i) }}> - </button>
            {/if}
            <br>
        {/each}
        <br>
        <button type="button" on:click={submitForm}>Add new slide</button>
    </form> 
</div>

<style>

</style>