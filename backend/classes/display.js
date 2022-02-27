class Display {
    constructor (socket, data) {
        this.socket = socket;
        this.data = data;
        this.slide = null;
    }

    sendSlide(slide) {
        this.slide = slide;
        this.socket.send(JSON.stringify({
            action: 'slide',
            slide: slide
        }));
    }

    getSlide() {
        return this.slide;
    }
}

module.exports = Display;