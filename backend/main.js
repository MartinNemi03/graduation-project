const uuid = require('uuid');

const Display = require('./classes/display.js');
let displays = new Map();

async function main() {
    let slides = [
        {
            type: 'video', 
            data: { 
                link: "/display/content/mp4/dQw4w9WgXcQ.mp4" 
            }
        }
    ];

    let id = 0;
    setInterval(async () => {
        id += 1;
        if (id >= slides.length) id = 0;

        let slide = await require('./scripts/render-slide').render(slides[id].type, slides[id].data);
        displays.forEach((display) => {
            display.socket.send(JSON.stringify({
                action: 'slide',
                slide: slide
            }));
        });
    }, (10 * 1000));
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
    }
};

require('./server.js');
main();





