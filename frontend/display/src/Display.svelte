<script>
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';

    import Overlay from './Overlay.svelte';

    let socket, state, news = [];
    let slide;
    const updateState = () => { 
        state = socket.readyState; 
        if (state != 1) slide = null;
    };

    function startSocket() {
        socket = new WebSocket(`wss://${window.location.host}/display`);
        updateState();

        socket.onopen = () => {
            console.log('Websocket connected.');
            updateState();
        };

        socket.onclose = () => {
            console.log('Websocket closed.');
            setTimeout(checkSocket, 1000);
            updateState();
        };

        socket.onmessage = (event) => {
            let data = JSON.parse(event.data);

            switch (data?.action) {
                case "slide":
                    slide = data.slide;
                    break;
                case "news":
                    news = data.news;
                    break;
            }
        };
    };

    function checkSocket() {
        state = 0;
        setTimeout(startSocket, 3000);
    }

    onMount(() => {
        checkSocket();
    });
</script>

<main>
    <h1 id="socket-info">
        {#if state == 0 || state == null}
            Websocket is connecting..
        {:else if state == 2}
            Websocket is closing..
        {:else if state == 3}
            Websocket was closed!
        {/if}
    </h1>
    <Overlay news={news}/>

    {#if slide != null}
        {#key slide}
            <div id="slide-{slide.id}" class="slide-container" transition:fade>
                {@html '<style>' + slide.render.css.code + '</style>'}
                {@html slide.render.html}
            </div>
        {/key}
    {/if}
</main>

<style>
    main {
        overflow: hidden;
        width: 100%;
        height: 100%;
    }

    #socket-info {
        position: absolute;
        color: white;
        font-size: 5vw;
        margin: 5vw;
    }

    div {
        width: 100%;
        height: calc(100% - var(--overlay-height));
    }

    .slide-container {
        position: absolute;
    }
</style>