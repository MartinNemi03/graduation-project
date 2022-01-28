<script>
    import { onMount } from 'svelte';
    import DragList from '../../components/DragList.svelte';

    let ready = false;
    let error = false;

    let availableSlides = [];
    let defaultQueue = [];
    // TODO: Add loading of slides and default queue from API

    const catchError = (err) => {
        error = true;
        if (err) console.error(err);
    };

    const getAvailableSlides = async () => {
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
                    availableSlides = res.slides;
                    availableSlides.forEach(slide => {
                        slide.id = slide._id;
                        delete slide._id;
                    });
                }
            });
        }).catch(catchError);
    };

    const getDefaultQueue = async () => {
        await fetch('../../api/queue/default/list', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'GET'
        }).then((req) => {
            if (req.status !== 200) catchError(req)
            else req.json().then((res) => {
                if (res.success = false) catchError(res)
                else {
                    defaultQueue = res.queue;
                    defaultQueue.forEach(slide => {
                        availableSlides = availableSlides.filter((value) => {
                            return value.id != slide.id;
                        });
                    });
                }
            });
        }).catch(catchError);
    };

    const getAll = async () => {
        ready = false;

        await getAvailableSlides();
        await getDefaultQueue();

        ready = true;
    };

    onMount(async () => {
        await getAll();
    });
</script>

<div id="content">
    {#if error}
        <div class="d-flex justify-content-center m-3">
            <h3>An error has occured.</h3>
        </div>
    {/if}

    {#if ready}
        <div class="row">
            <div class="col-6">
                <h3>Available Slides</h3>
                <DragList items={availableSlides}/>       
            </div>
            <div class="col-6">
                <h3>Default Queue</h3>
                <DragList items={defaultQueue}/>
            </div>
        </div>
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