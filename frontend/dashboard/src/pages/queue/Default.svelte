<script>
    import DragList from '../../components/DragList.svelte';
    let ready = false;

    let items = [];
    // TODO: Add loading of slides and default queue from API
</script>

<div id="content">
    {#if ready}
        <div class="row">
            <div class="col-5">
                <DragList items={items}/>       
            </div>
            <div class="col-2">

            </div>
            <div class="col-5">
                <DragList items={[]}/>
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