<script>
    import { toast } from '@zerodevx/svelte-toast';

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
        "video",
        "text"
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

    const catchError = (err) => {
        toast.push("Form submittion failed..");
        if (err) console.error(err);
    };

    const submitForm = async () => {
        console.log(JSON.stringify(form));

        await fetch('../../api/slides/add', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(form)
        }).then((req) => {
            if (req.status !== 200) catchError()
            else req.json().then((res) => {
                console.log(res);
                toast.push(`Slide was added successfully! <small>(ID: ${res.slide._id})</small>`);
            });
        }).catch(catchError);
    };
</script>

<div id="content">
    <form>
        <p>
            { JSON.stringify(form) }<br>
            { JSON.stringify(data) }
        </p>

        <small>Type:</small><br>
        <div class="row type-row">
            <div class="col-4">
                <select class="form-select" name="type" id="slide-type" bind:value={form.type}>
                    <option value="">Custom</option>
                    {#each availableTypes as type}
                        <option value="{type}">{type}</option>
                    {/each}
                </select>
            </div>
            <div class="col-4">
                {#if !availableTypes.includes(form.type)}
                    <input type="text" class="form-control" name="actual-type" id="slide-actual-type" placeholder="Custom Type" bind:value={form.type}>
                {/if}
            </div>
        </div>

        <br><small>Data:</small><br>
        {#each data as item, i}
        <div class="row data-row">
            <div class="col">
                <input type="text" class="form-control" name="data-key-{i}" id="data-key-{i}" placeholder="Data Key" on:change={updateData} bind:value={data[i].key}>
            </div>
            <div class="col">
                <input type="text" class="form-control" name="data-value-{i}" id="data-value-{i}" placeholder="Data Value" on:change={updateData} bind:value={data[i].value}>
            </div>
            <div class="col">
                <button type="button" class="btn btn-success" on:click={addData}> + </button>
                {#if i > 0}
                    <button type="button" class="btn btn-danger" on:click={() => { removeData(i) }}> - </button>
                {/if}
            </div>
        </div>
        <br>    
        {/each}
        <br>
        <button type="button" class="btn btn-primary" on:click={submitForm}>Add new slide</button>
    </form>
</div>

<style>

</style>