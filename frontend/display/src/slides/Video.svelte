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

<slide class="slide slide-video">
    <!-- svelte-ignore a11y-media-has-caption -->
    <video class="playback" src="{data.link}" type="video/mp4" autoplay loop muted></video>
    Your browser does not support HTML5 video.
</slide>

<style>
    video {
        width: 100%;
    }
</style>