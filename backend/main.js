const uuid = require('uuid');
require('dotenv').config();

const Display = require('./classes/display.js');
let displays = new Map();

let currentSlide;
let currentNews;

const handleError = (e) => {
    return {
        success: false,
        error: e.toString()
    };
};

const updateSlide = (slide = {}) => {
    currentSlide = slide;
    displays.forEach((display) => display.sendSlide(currentSlide));
};

const updateNews = (news = []) => {
    currentNews = news;
    displays.forEach((display) => display.sendNews(currentNews));
};

module.exports = {
    addDisplay: (socket, data = {}) => {
        data.id = uuid.v4().slice(0, 8);
        socket.id = data.id;

        const display = new Display(socket, data);
        displays.set(data.id, display);

        display.sendSlide(currentSlide);
        display.sendNews(currentNews);

        return socket;
    },
    removeDisplay: (id) => {
        displays.delete(id);
    },
    getDisplays: () => {
        try {
            if (displays.size <= 0) 
                throw "No displays were found.";

            let displayArray = [];
            displays.forEach((display, id) => {
                displayArray.push({
                    id: id,
                    data: display.getData(),
                    slide: display.getSlide()
                });
            });

            return {
                success: true,
                displays: displayArray
            };
        } catch (e) {
            return handleError(e);
        }
    },
    getCurrentSlide: () => {
        try {
            if (!currentSlide) 
                throw "No current slide is available.";

            return {
                success: true,
                current: currentSlide
            };
        } catch (e) {
            return handleError(e);
        }
    },
    updateCurrentSlide: (slide) => {
        if (slide != null) {
            currentSlide = slide;
            updateSlide(slide);
        } else currentSlide = null;
    },
    getCurrentNews: () => {
        try {
            if (!currentNews) 
                throw "No current news are available.";

            return {
                success: true,
                current: currentNews
            };
        } catch (e) {
            return handleError(e);
        }
    },
    updateCurrentNews: (news) => {
        if (news != null) {
            currentNews = news;
            updateNews(news);
        } else currentNews = null;
    }
};

require('./helper');
require('./server');

require('./news');
require('./queue');





