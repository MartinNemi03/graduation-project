<script>
    export let data;

    const text = data?.text || "No text found.";
</script>

<div class="slide slide-text">
    <div class="text-wrapper">{@html text}</div>
</div>

<style>
    .slide-text {
        display: inline-block;
        position: absolute;
        top: calc(50% - var(--overlay-height));
        left: 50%;
        font-size: 100px;
    }

    .text-wrapper {
        position: relative;
        left: -50%;
    }
</style>