const main = require('./main');
const mongo = require('./db/mongo');
const { render } = require('./scripts/render-slide');

const path = require('path');
const fs = require('fs');

let queue = [];

let currentQueue = [];
let defaultQueue = [];

let defaultId = 0;
let queuesLoaded = false;

const getFromDefault = () => {
    const slide = [...defaultQueue][defaultId];
    defaultId += 1;

    if (defaultId >= defaultQueue.length) defaultId = 0;
    return slide;
};

const getUpcomingSlide = () => {
    if (currentQueue[0] == null) 
        return getFromDefault();
    else
        return currentQueue.shift();
};

const prepareSlide = async (slide) => {
    try {
        console.log(`${Date.now()}: Preparing slide`);
        slide.error = false;

        let s = await mongo.getSlide(slide.id);
        if (!s.success) throw s.error;
        slide.slide = s.slide;

        slide.render = await render(s.slide.slide.type, s.slide.slide.data);

        console.log(`${Date.now()}: Returning slide`);
        return slide;
    } catch (e) {
        console.error("Error while preparing slide: " + e);
        slide.error = true;
    }
};

const checkSlidesInQueue = async () => {
    try {
        if (queue.length <= 0) {
            let currentSlide = await main.getCurrentSlide();

            let queuedTimestamp;
            if (currentSlide != null)
                queuedTimestamp = ((currentSlide.queued_timestamp || Date.now()) + (1000 * currentSlide.duration));
            else queuedTimestamp = (Date.now() + 5000);

            let slide = getUpcomingSlide();

            if (slide != null) {
                slide.queued_timestamp = queuedTimestamp;
                queue[0] = slide;
            }
        }

        for (let i = 0; i < queue.length; i++) {
            if (((queue[i]?.queued_timestamp - Date.now() <= 15000) && !queue[i]?.render) 
            || Date.now() - queue[i]?.queued_timestamp >= 5000)
                queue[i] = await prepareSlide(queue[i]);
        }
    } catch (e) {
        console.error(e);
    }
};

const readJson = (filePath) => {
    if (fs.existsSync(filePath))
        return JSON.parse(fs.readFileSync(filePath))
    else return null;
};

const saveJson = (filePath, fileData) => {
    return fs.writeFileSync(filePath, JSON.stringify(fileData));
};

const paths = {
    cacheFolder: path.resolve('./backend/cache'),
    currentQueue: path.resolve('./backend/cache/queue-current.json'),
    defaultQueue: path.resolve('./backend/cache/queue-default.json')
};

const loadQueue = (filePath) => {
    let queue = readJson(filePath);
    queue = queue ? queue : [];
    saveJson(filePath, queue);
    return queue;
};

const loadQueues = () => {
    try {
        console.log(`${Date.now()}: Loading queues..`);
        if (!fs.existsSync(paths.cacheFolder))
            fs.mkdirSync(paths.cacheFolder)

        currentQueue = loadQueue(paths.currentQueue);
        defaultQueue = loadQueue(paths.defaultQueue);

        queuesLoaded = true;
        console.log(`${Date.now()}: Queues loaded!`);
    } catch (e) {
        console.error(e);
    }
};

const mainFunc = async () => {
    try {
        if (!mongo.ready()) return;

        if (!queuesLoaded) return loadQueues();
        await checkSlidesInQueue();

        if (!queue[0]) return;
        if (queue[0].queued_timestamp >= Date.now()) return;

        let slide = queue.shift();
        console.log(slide);

        main.updateCurrentSlide(slide);
    } catch (e) {
        console.error("Error in queue's main function: " + e);
    }
};

module.exports = {
    getCurrent: () => {
        return currentQueue;
    },
    updateCurrent: (queue) => {
        saveJson(paths.currentQueue, queue);
        currentQueue = queue;
    },
    getDefault: () => {
        return defaultQueue;
    },
    updateDefault: (queue) => {
        saveJson(paths.defaultQueue, queue);
        defaultQueue = queue;
    }
}

mainFunc();
setInterval(mainFunc, 1000);