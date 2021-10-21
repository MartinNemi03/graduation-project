<script>
    import { onMount } from 'svelte';
    import Overlay from './Overlay.svelte';

    let socket, state, slide;
    const updateState = () => { 
        state = socket.readyState; 
        if (state != 1) slide = null;
    };

    function startSocket() {
        socket = new WebSocket(`ws://${window.location.host}/display`);
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

            if (data.action == "slide") {
                slide = data.slide;
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
    <Overlay/>

    {#if slide != null}
        {@html '<style>' + slide.css.code + '</style>'}
        {@html slide.html}
    {/if}
</main>

<style>
    main {
        background: gray; 
        overflow: hidden;
        width: 100%;
        height: 100%;
    }

    #socket-info {
        position: absolute;
        font-size: 5vw;
        margin: 5vw;
    }
</style>