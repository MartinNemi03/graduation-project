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
        console.log(`Preparing slide #${slide.id}`);
        slide.error = false;

        let s = await mongo.getSlide(slide.id);
        if (!s.success) throw s.error;
        slide.slide = s.slide.slide;

        let r = await render(s.slide.slide.type, s.slide.slide.data);
        if (!r.success) throw r.error;
        slide.render = r.render;

        console.log(`Returning slide #${slide.id}`);
        return slide;
    } catch (e) {
        console.error("Error while preparing slide: " + e);
        slide.error = true;
        return slide;
    }
};

const checkSlidesInQueue = async () => {
    try {
        if (queue.length <= 0) {
            let currentSlide = await main.getCurrentSlide();

            let queuedTimestamp;
            if (currentSlide != null) {
                queuedTimestamp = ((currentSlide.queued_timestamp || Date.now()) + (1000 * currentSlide.duration));
            } else queuedTimestamp = (Date.now() + 5000);

            if (queuedTimestamp - Date.now() > 15000) return;
            let slide = getUpcomingSlide();

            if (slide != null && !slide?.error) {
                slide.queued_timestamp = queuedTimestamp;
                queue[0] = slide;
            }
        }

        for (let i = 0; i < queue.length; i++) {
            let timeUntil = queue[i]?.queued_timestamp - Date.now();
            let timeTo = Date.now() - queue[i]?.queued_timestamp;

            if (((timeUntil <= 15000) && !queue[i]?.render) || timeTo >= 5000) {
                let preparedSlide = await prepareSlide(queue[i]);
                if (preparedSlide?.error) {
                    queue.splice(i, 1);
                    console.log(queue);
                    continue;
                }

                queue[i] = preparedSlide;
            }
        }
    } catch (e) {
        console.error(e);
    }
};

const readJson = (filePath) => {
    if (fs.existsSync(filePath))
        return JSON.parse(fs.readFileSync(filePath));
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

const loadQueues = async () => {
    try {
        console.log(`Loading queues..`);
        if (!fs.existsSync(paths.cacheFolder))
            fs.mkdirSync(paths.cacheFolder);

        currentQueue = loadQueue(paths.currentQueue);
        defaultQueue = loadQueue(paths.defaultQueue);

        console.log(`Preparing all slides in queues..`);

        if (currentQueue.length > 0)
            for (let i = 0; i < currentQueue.length; i++)
                currentQueue[i] = await prepareSlide(currentQueue[i]);

        if (defaultQueue.length > 0)
            for (let i = 0; i < defaultQueue.length; i++)
                defaultQueue[i] = await prepareSlide(defaultQueue[i]);

        console.log(`All slides prepared!`);

        queuesLoaded = true;
        console.log(`Queues loaded!`);
    } catch (e) {
        console.error(e);
    }
};

const saveQueue = (filePath, queueData) => {
    try {
        for (let i = 0; i < queueData.length; i++) {
            const slide = queueData[i];
            queueData[i] = {
                id: slide.id,
                duration: slide.duration || 60
            };
        }

        console.log(queueData);
        saveJson(filePath, queueData);
        // TODO: Přidat ukládání queue, kde se fronta pročistí od nadbytečných infomací a zůstane jen id a duration
    } catch (e) {
        console.log(e);
    }
};

const mainFunc = async () => {
    try {
        if (!mongo.ready()) return;

        if (!queuesLoaded) return await loadQueues();
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
        currentQueue = queue;
        saveQueue(paths.currentQueue, currentQueue);
    },
    getDefault: () => {
        return defaultQueue;
    },
    updateDefault: (queue) => {
        defaultQueue = queue;
        saveQueue(paths.defaultQueue, defaultQueue);
    },
    getUpcomingSlide: () => {
        if (queue[0] != null) 
            return queue[0];
        else if (currentQueue[0] == null) {
            if (defaultId >= defaultQueue.length) 
                defaultId = 0;
            return [...defaultQueue][defaultId];
        } else 
            return currentQueue[0];
    } 
};

mainFunc();
setInterval(mainFunc, 1000);