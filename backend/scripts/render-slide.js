const slideTypes = {
    video: '../../frontend/display/src/slides/Video.svelte',
    text: '../../frontend/display/src/slides/Text.svelte'
}

module.exports = {
    render: async (type = "", data = {}) => {
        try {
            require('svelte/register');
            let component = require(slideTypes[type]).default;

            let render = component.render({ data: data });
            render.type = type;

            return {
                success: true,
                render: render
            };
        } catch (e) {
            return {
                success: false, 
                error: e.toString()
            };
        }
    }
}