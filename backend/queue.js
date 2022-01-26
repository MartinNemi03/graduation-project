const mongo = require('./db/mongo');

let currentQueue = [];
let defaultQueue = [
    { 
        duration: 60,
        _id: ""
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

    if (currentQueue[0] == null) 
        slide = getFromDefault();
    else
        slide = currentQueue.shift();

    if (slide?.id)
        slide.slide = await mongo.getSlide(slide.id);


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