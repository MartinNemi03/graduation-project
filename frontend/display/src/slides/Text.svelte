<script>
    export let data;

    const text = data?.text || "No text found.";
    const bgColor = data?.backgroundColor || "black";
    const textColor = data?.textColor || "white";
</script>

<div class="slide slide-text" style="background-color: {bgColor}">
    <div class="text-div">
        <div class="text-wrapper" style="color: {textColor}">{@html `${text}`}</div>
    </div>
</div>

<style>
    .slide-text {
        width: 100%;
        height: 100%;
    }

    .text-div {
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