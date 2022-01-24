const uuid = require('uuid');
require('dotenv').config();

const Display = require('./classes/display.js');
let displays = new Map();

const queue = require('./queue');
let currentSlide;

async function updateSlide(slide) {
    currentSlide = slide;
    currentSlide.render = await require('./scripts/render-slide').render(slides[id].type, slides[id].data);
    displays.forEach((display) => display.sendSlide(currentSlide));
}

module.exports = {
    addDisplay: (socket, data = {}) => {
        data.id = uuid.v4();
        socket.id = data.id;
        displays.set(data.id, new Display(socket, data));
        return socket;
    },
    removeDisplay: (id) => {
        displays.delete(id);
    },
    getCurrentSlide: () => {
        return currentSlide;
    },
    updateCurrentSlide: (slide) => {
        if (slide != null) {
            currentSlide = slide;
            updateSlide(slide);
        }
    }
};

require('./server.js');





