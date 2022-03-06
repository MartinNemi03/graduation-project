<script>
    import { onMount } from 'svelte';
    import { toastSuccess, toastError } from '../../../public/toast';
    import SlideDragList from '../../components/SlideDragList.svelte';
    import RefreshButton from '../../components/RefreshButton.svelte';

    let ready = false;
    let readyTimestamp = 0;

    let error = false;

    let availableSlides = [];
    let currentQueue = [];

    let serverCache = {
        availableSlides: [],
        currentQueue: []
    };

    const catchError = (err, resetQueue = false) => {
        toastError("Nastala chyba!");
        if (err) console.error(err);
        if (resetQueue) {
            availableSlides = serverCache.availableSlides;
            currentQueue = serverCache.currentQueue;
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

    const getCurrentQueue = async () => {
        await fetch('../../api/queue/current/list', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'GET'
        }).then((req) => {
            if (req.status !== 200) catchError(req)
            else req.json().then((res) => {
                if (res.success = false) catchError(res)
                else {
                    currentQueue = res.queue;
                    for (let i = 0; i < currentQueue.length; i++) {
                        const slide = currentQueue[i];

                        availableSlides = availableSlides.filter((value) => {
                            return value.id != slide.id;
                        });
                    }

                    serverCache.currentQueue = currentQueue;
                }
            });
        }).catch(catchError);
    };

    const updateCurrentQueue = async (newQueue) => {
        await fetch('../../api/queue/current/update', {
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
                    currentQueue = newQueue;

                    serverCache.currentQueue = currentQueue;
                    serverCache.availableSlides = availableSlides;

                    toastSuccess(`Current queue was updated!`);
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
        await getCurrentQueue();

        readyTimestamp = Date.now();
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
        <RefreshButton timestamp={readyTimestamp} onRefresh={getAll}/>
        <div class="row">
            <div class="col-6 mt-3">
                <h3>Available Slides</h3><hr>
                <SlideDragList items={availableSlides} onDrop={setAvailableSlides}/>       
            </div>
            <div class="col-6 mt-3">
                <h3>Current Queue</h3><hr>
                <SlideDragList items={currentQueue} onDrop={updateCurrentQueue}/>
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