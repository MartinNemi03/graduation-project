let currentQueue = [];

let defaultQueue = [];
let dId = 0;

const getFromDefault = () => {
    dId += 1;
    if (dId >= defaultQueue.length) dId = 0;

    return defaultQueue[0];
};

async function main() {
    let slide;

    if (currentQueue[0] == null) {
        getFromDefault();
    } else {
        
    }
}

module.exports = {
    getCurrent: () => {

    },
    updateCurrent: (queue) => {

    },
    getDefault: () => {

    },
    updateDefault: (queue) => {

    }
}

main();
setInterval(main, 1000);