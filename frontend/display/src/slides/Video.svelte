<script>
    export let data;
    import { onMount } from 'svelte';

    onMount(() => {
        playVideo();
    });

    function playVideo() {
        document.querySelector('video').play();
    }
</script>

<div class="slide slide-video">
    <!-- svelte-ignore a11y-media-has-caption -->
    <video class="playback" src="{data.link}" type="video/webm" autoplay loop muted></video>
    Your browser does not support HTML5 video.
</div>

<style>
    video {
        width: 100%;
    }
</style>