const slideTypes = {
    video: '../../frontend/display/src/slides/Video.svelte'
}

module.exports = {
    render: async (type, data) => {
        require('svelte/register');
        let component = require(slideTypes[type]).default;

        let render = component.render({ data: data });
        render.type = type;

        return render;
    }
}