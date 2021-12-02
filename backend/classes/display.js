class Display {
    constructor (socket, data) {
        this.socket = socket;
        this.data = data;
    }

    sendSlide(slide) {
        this.socket.send(JSON.stringify({
            action: 'slide',
            slide: slide
        }));
    }
}

module.exports = Display;