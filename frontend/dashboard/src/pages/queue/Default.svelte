<script>
    import { onMount } from 'svelte';
    import { toastSuccess, toastError } from '../../../public/toast';
    import SlideDragList from '../../components/SlideDragList.svelte';

    let ready = false;
    let error = false;

    let availableSlides = [];
    let defaultQueue = [];

    let serverCache = {
        availableSlides: [],
        defaultQueue: []
    };

    const catchError = (err, resetQueue = false) => {
        toastError("Nastala chyba!");
        if (err) console.error(err);
        if (resetQueue) {
            availableSlides = serverCache.availableSlides;
            defaultQueue = serverCache.defaultQueue;
        }
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
                        slide.duration = 60;
                        delete slide._id;
                    });

                    serverCache.availableSlides = availableSlides;
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
                    for (let i = 0; i < defaultQueue.length; i++) {
                        const slide = defaultQueue[i];

                        availableSlides = availableSlides.filter((value) => {
                            return value.id != slide.id;
                        });
                    }

                    serverCache.defaultQueue = defaultQueue;
                }
            });
        }).catch(catchError);
    };

    const updateDefaultQueue = async (newQueue) => {
        await fetch('../../api/queue/default/update', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(newQueue)
        }).then((req) => {
            if (req.status !== 200) catchError(req, true);
            else req.json().then((res) => {
                if (res.success = false) catchError(res, true);
                else {
                    defaultQueue = newQueue;

                    serverCache.defaultQueue = defaultQueue;
                    serverCache.availableSlides = availableSlides;

                    toastSuccess(`Default queue was updated!`);
                }
            });
        }).catch(catchError);
    };

    const setAvailableSlides = async (newList) => {
        availableSlides = newList;
        console.log(newList);
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
                <SlideDragList items={availableSlides} onDrop={setAvailableSlides}/>       
            </div>
            <div class="col-6">
                <h3>Default Queue</h3>
                <SlideDragList items={defaultQueue} onDrop={updateDefaultQueue}/>
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
    h3 {
        text-align: center;
    }
</style>