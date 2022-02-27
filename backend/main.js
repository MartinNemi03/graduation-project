const uuid = require('uuid');
require('dotenv').config();

const Display = require('./classes/display.js');
let displays = new Map();

let currentSlide;

const updateSlide = (slide) => {
    currentSlide = slide;
    displays.forEach((display) => display.sendSlide(currentSlide));
};

module.exports = {
    addDisplay: (socket, data = {}) => {
        data.id = uuid.v4();
        socket.id = data.id;

        const display = new Display(socket, data);
        displays.set(data.id, display);
        display.sendSlide(currentSlide);

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
        } else currentSlide = null;
    }
};

require('./server');
require('./queue');





