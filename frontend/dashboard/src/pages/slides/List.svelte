<script>
    import { onMount } from 'svelte';

    let slides = [];
    let ready = false;
    let error = false;

    const catchError = (err) => {
        error = true;
        if (err) console.error(err);
    };

    const updateList = async () => {
        ready = false;
        error = false;

        await fetch('../../api/slides/list', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'GET'
        }).then((req) => {
            if (req.status !== 200) catchError(req)
            else req.json().then((res) => {
                if (res.success = false) catchError(res)
                else {
                    slides = res.slides;
                    ready = true;

                    console.log(slides);
                }
            });
        }).catch(catchError);
    };

    onMount(async () => {
        await updateList();
    });
</script>

<div id="content">
    {#if error}
        <div class="d-flex justify-content-center m-3">
            <h3>An error has occured.</h3>
        </div>
    {/if}

    {#if ready}
        {#if slides.length > 0}
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Type</th>
                        <th scope="col">Data</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    {#each slides as row}
                        <tr>
                            <td>{row._id}</td>
                            <td>{row.slide.type}</td>
                            <td>{JSON.stringify(row.slide.data)}</td>
                            <td><button>X</button></td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        {:else}
            <div class="d-flex justify-content-center m-5">
                <h2>There are no slides.</h2>
            </div>
        {/if}
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