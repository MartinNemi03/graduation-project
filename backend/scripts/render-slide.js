const slideTypes = {
    video: '../../frontend/display/src/slides/Video.svelte'
}

module.exports = {
    render: async (data) => {
        console.log(data);

        require('svelte/register');
        let component = require(slideTypes.video).default;

        const html = component.render({ data: data });
        console.log(html);
    }
}

module.exports.render({ link: "/display/content/dQw4w9WgXcQ.mp4" });