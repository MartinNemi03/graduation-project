const mongo = require('./db/mongo');

let currentQueue = [];
let defaultQueue = [
    { 
        duration: 60,
        id: "73bbe73c"
    }
];

let dId = 0;

const getFromDefault = () => {
    dId += 1;
    if (dId >= defaultQueue.length) dId = 0;

    return defaultQueue[dId];
};

async function main() {
    let slide;

    if (!require('./db/mongo').ready) return;

    if (currentQueue[0] == null) 
        slide = getFromDefault();
    else
        slide = currentQueue.shift();

    if (slide?.id) {
        let s = await mongo.getSlide(slide.id);
        slide.slide = s.slide;
    }

    console.log(slide);
}

module.exports = {
    getCurrent: () => {
        return currentQueue;
    },
    updateCurrent: (queue) => {
        currentQueue = queue;
    },
    getDefault: () => {
        return defaultQueue;
    },
    updateDefault: (queue) => {
        defaultQueue = queue;
    }
}

main();
setInterval(main, 60000);