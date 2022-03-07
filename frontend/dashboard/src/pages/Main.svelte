<script>
    import { onMount } from 'svelte';
    import { toastSuccess, toastError } from '../../public/toast';

    import SlideCard from '../components/SlideCard.svelte';
    import DisplayCard from '../components/DisplayCard.svelte';
    import RefreshButton from '../components/RefreshButton.svelte';

    let ready = false;
    let readyTimestamp = 0;

    let error = false;

    let currentSlide;
    let upcomingSlide;
    let connectedDisplays;

    const catchError = (err) => {
        toastError("Nastala chyba!");
        error = true;

        if (err) console.error(err);
    };

    const getCurrentSlide = async () => {
        await fetch('../../api/slides/current', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'GET'
        }).then((req) => {
            if (req.status !== 200) catchError(req)
            else req.json().then((res) => {
                if (res.success == false) currentSlide = null;
                else currentSlide = res?.current;
            });
        }).catch(catchError);
    };

    const getUpcomingSlide = async () => {
        await fetch('../../api/slides/upcoming', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'GET'
        }).then((req) => {
            if (req.status !== 200) catchError(req)
            else req.json().then((res) => {
                if (res.success == false) upcomingSlide = null;
                else upcomingSlide = res?.upcoming;
            });
        }).catch(catchError);
    };

    const getConnectedDisplays = async () => {
        await fetch('../../api/display/list', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'GET'
        }).then((req) => {
            if (req.status !== 200) catchError(req)
            else req.json().then((res) => {
                if (res.success == false) connectedDisplays = null;
                else connectedDisplays = res.displays;
            });
        }).catch(catchError);
    };

    const getAll = async () => {
        ready = false;

        await getCurrentSlide();
        await getUpcomingSlide();
        await getConnectedDisplays();

        if (error) return;
        readyTimestamp = Date.now();
        ready = true;
    };

    let statusTimeout = false;
    const onStatusChange = async (newStatus, needToRefresh) => {
        if (!ready || statusTimeout) return;
        if (newStatus === needToRefresh) {
            statusTimeout = true;
            await getAll();
            setTimeout(() => {
                statusTimeout = false;
            }, 1000);
        }
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
        <RefreshButton timestamp={readyTimestamp} onRefresh={getAll} defaultTimer={120} timerSeconds={[75, 90, 120]}/>
        <div class="row row mt-md-3 mt-5">
            <div class="col-6">
                <h3>Current Slide</h3><hr> 
                {#if currentSlide != null}
                    <SlideCard item={currentSlide} onStatusChange={(status) => {onStatusChange(status, "already_displayed")}}/>
                {:else}
                    <h4>No current slide was found.</h4>
                {/if}
            </div>
            <div class="col-6">
                <h3>Upcoming Slide</h3><hr>
                {#if upcomingSlide != null}
                    <SlideCard item={upcomingSlide} onStatusChange={(status) => {onStatusChange(status, "displaying")}}/>
                {:else}
                    <h4>No upcoming slide was found.</h4>
                {/if}
            </div>
        </div>
        <div class="row">
            <div class="col mt-3">
                <h3>All connected displays:</h3><hr>
            </div>
        </div>
        {#if connectedDisplays != null}
            <div class="row">
                {#each connectedDisplays as display}
                    <div class="col-lg-4 col-md-6 col-sm-12">
                        <DisplayCard item={display}/><br>
                    </div>
                {/each}
            </div>
        {:else}
            <h4>No connected displays were found.</h4>
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
    h3 {
        text-align: center;
    }

    h4 {
        color: rgba(0, 0, 0, 0.5);
        text-align: center;
    }
</style>