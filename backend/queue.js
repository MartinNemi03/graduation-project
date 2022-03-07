const main = require('./main');
const helper = require('./helper');
const mongo = require('./db/mongo');
const { render } = require('./scripts/render-slide');

const path = require('path');

let queue = [];

let currentQueue = [];
let defaultQueue = [];

let defaultId = 0;
let queuesLoaded = false;
let queuesLoading = false;
let queuesError = false;

const handleError = (e) => {
    console.error(e);

    return {
        success: false,
        error: e.toString()
    };
};

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
            let currentSlide = await main.getCurrentSlide()?.current;

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
            let timeSinceRender = Date.now() - queue[i]?.render?.time;

            if (((timeUntil <= 15000) && (!queue[i]?.render || (timeSinceRender >= 90000)))) {
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

const paths = {
    currentQueue: path.resolve('./backend/cache/queue-current.json'),
    defaultQueue: path.resolve('./backend/cache/queue-default.json')
};

const loadQueue = (filePath) => {
    let queue = helper.readJson(filePath);
    queue = queue ? queue : [];
    helper.saveJson(filePath, queue);
    return queue;
};

const loadQueues = async () => {
    try {
        queuesLoading = true;

        console.log(`Loading queues..`);

        currentQueue = await loadQueue(paths.currentQueue);
        defaultQueue = await loadQueue(paths.defaultQueue);

        console.log(`Preparing all slides in queues..`);

        if (currentQueue.length > 0)
            for (let i = 0; i < currentQueue.length; i++)
                currentQueue[i] = await prepareSlide(currentQueue[i]);

        if (defaultQueue.length > 0)
            for (let i = 0; i < defaultQueue.length; i++)
                defaultQueue[i] = await prepareSlide(defaultQueue[i]);

        console.log(`All slides prepared!`);

        queuesLoading = false;
        queuesLoaded = true;
        console.log(`Queues loaded!`);
    } catch (e) {
        queuesError = true;
        console.error(e);
    }
};

const saveQueues = async () => {
    try {
        console.log(`Saving all queues..`);

        saveQueue(paths.currentQueue, currentQueue);
        saveQueue(paths.defaultQueue, defaultQueue);

        console.log(`Queues saved!`);
    } catch (e) {
        console.error(e);
    }
};

const saveQueue = (filePath, qData) => {
    try {
        const queueData = [...qData];
        for (let i = 0; i < queueData.length; i++) {
            const slide = queueData[i];
            queueData[i] = {
                id: slide.id,
                duration: slide.duration || 60
            };
        }

        helper.saveJson(filePath, queueData);
    } catch (e) {
        console.error(e);
    }
};

const waitForLoad = () => {
    return new Promise((resolve) => {
        let int = setInterval(() => {
            if (queuesLoaded) {
                clearInterval(int);
                resolve();
            }
        }, 100);
    });
};

const mainFunc = async () => {
    try {
        if (!mongo.ready() || queuesLoading) return;
        if (!queuesLoaded) return await loadQueues();
        await checkSlidesInQueue();

        if (!queue[0]) return;
        if (queue[0].queued_timestamp >= Date.now()) return;

        let slide = queue.shift();
        main.updateCurrentSlide(slide);
    } catch (e) {
        console.error("Error in queue's main function: " + e);
    }
};

module.exports = {
    getCurrent: async () => {
        try {
            if (queuesError) throw new Error();
            if (!queuesLoaded) await waitForLoad();

            return {
                success: true,
                queue: currentQueue
            };
        } catch (e) {
            return handleError(e);
        }
    },
    updateCurrent: (queue) => {
        try {
            currentQueue = queue;
            saveQueue(paths.currentQueue, currentQueue);

            return {
                success: true,
                queue: currentQueue
            };
        } catch (e) {
            return handleError(e);
        }
    },
    getDefault: async () => {
        try {
            if (queuesError) throw new Error();
            if (!queuesLoaded) await waitForLoad();

            return {
                success: true,
                queue: defaultQueue 
            };
        } catch (e) {
            return handleError(e);
        }
    },
    updateDefault: (queue) => {
        try {
            defaultQueue = queue;
            saveQueue(paths.defaultQueue, defaultQueue);

            return {
                success: true,
                queue: defaultQueue
            };
        } catch (e) {
            return handleError(e);
        }
    },
    getUpcomingSlide: async () => {
        try {
            if (queuesError) throw new Error();
            if (!queuesLoaded) await waitForLoad();
            let upcoming;

            if (queue[0] != null) 
                upcoming = queue[0];
            else if (currentQueue[0] == null) {
                if (defaultId >= defaultQueue.length) 
                    defaultId = 0;
                upcoming =  [...defaultQueue][defaultId];
            } else 
                upcoming = currentQueue[0];

            if (upcoming == null)
                throw new Error("Upcoming slide was not found.");

            return {
                success: true,
                upcoming: upcoming
            };
        } catch (e) {
            return handleError(e);
        }
    }
};

// Autosave the queues, so they are accurate
setInterval(saveQueues, (10 * 60 * 1000));

mainFunc();
setInterval(mainFunc, 1000);