<script>
    export let data;

    const coffeeImg = data?.coffee || null;
</script>

<div class="slide slide-coffee">
    <div class="coffee-wrapper">
        {#if coffeeImg !== null}
            <img id="coffee" src="{coffeeImg}" alt="">
        {:else}
            <h1>Error 418:<br>I'm a teapot</h1>
        {/if}
    </div>
</div>

<style>
    :root {
        --coffee-height: 65%;
    }

    .slide-coffee {
        display: inline-block;
        position: absolute;
        top: calc(((100% - var(--overlay-height)) - var(--coffee-height)) / 2);
        left: 50%;
        height: var(--coffee-height);
    }

    .coffee-wrapper {
        position: relative;
        left: -50%;
        height: 100%;
    }

    #coffee {
        height: 100%;
    }
</style>