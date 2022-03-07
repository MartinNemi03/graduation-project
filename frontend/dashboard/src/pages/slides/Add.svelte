<script>
    import { onMount } from 'svelte';
    import { toastSuccess, toastError } from '../../../public/toast';

    let ready = false;
    let error = false;

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

    const availableTypes = [];

    const catchError = (err) => {
        toastError("There was an error!");
        error = true;

        if (err) console.error(err);
    };

    const loadSlideTypes = () => {
        ready = false;

        fetch('../../api/slides/types', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'GET'
        }).then(async (req) => {
            if (req.status !== 200) catchError(req)
            else req.json().then((res) => {
                if (!res.success) return catchError(res.error)
                else for (const type in res.types)
                    availableTypes.push(type);
                ready = true;
            });
        }).catch(catchError);
    };

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
        if (form.type === "") return toastError("Slide type is empty.");

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
                toastSuccess(`Slide was added successfully! <small>(ID: ${res.slide._id})</small>`);
            });
        }).catch(catchError);
    };

    onMount(() => {
        loadSlideTypes();
    });
</script>

<div id="content">
    {#if error}
        <div class="d-flex justify-content-center m-3">
            <h3>An error has occured.</h3>
        </div>
    {/if}

    {#if ready}
        <form class="mt-3">
            <small>Type:</small><br>
            <div class="row type-row">
                <div class="col-lg-2 col-4">
                    <select class="form-select" name="type" id="slide-type" bind:value={form.type}>
                        <option value="">Custom</option>
                        {#each availableTypes as type}
                            <option value="{type}">{type}</option>
                        {/each}
                    </select>
                </div>
                <div class="col-lg-4 col-8">
                    {#if !availableTypes.includes(form.type)}
                        <input type="text" class="form-control" name="actual-type" id="slide-actual-type" placeholder="Custom Type" bind:value={form.type}>
                    {/if}
                </div>
            </div>

            <br><small>Data:</small><br>
            {#each data as item, i}
            <div class="row data-row">
                <div class="col-xxl-11 col-md-10 col-9">
                    <div class="input-group">
                        <input type="text" class="form-control" name="data-key-{i}" id="data-key-{i}" placeholder="Data Key" on:change={updateData} bind:value={data[i].key}>
                        <input type="text" class="form-control" name="data-value-{i}" id="data-value-{i}" placeholder="Data Value" on:change={updateData} bind:value={data[i].value}>
                    </div>
                </div>
                <div class="col-xxl-1 col-md-2 col-3">
                    <div class="input-group">
                        <button type="button" class="btn btn-success" on:click={addData}><i class="bi bi-plus-lg"></i></button>
                        {#if i > 0}
                            <button type="button" class="btn btn-danger" on:click={() => { removeData(i) }}><i class="bi bi-x-lg"></i></button>
                        {/if}
                    </div>
                </div>
            </div>
            <br>    
            {/each}
            <br>
            <button type="button" class="btn btn-primary" on:click={submitForm}>Add new slide</button>
        </form>
    {:else}
        <div class="d-flex justify-content-center m-5">
            <div class="spinner-border text-dark" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    {/if}
</div>

<style>

</style>