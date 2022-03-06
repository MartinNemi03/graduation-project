class Display {
    constructor (socket, data) {
        this.socket = socket;
        this.data = data;

        this.slide = {};
        this.news = [];
    }

    getData() {
        return this.data;
    }

    sendSlide(slide) {
        this.slide = slide;
        this.socket.send(JSON.stringify({
            action: 'slide',
            slide: slide
        }));
    }

    sendNews(news) {
        this.news = news;
        this.socket.send(JSON.stringify({
            action: 'news',
            news: news
        }));
    }

    getSlide() {
        return this.slide;
    }

    getNews() {
        return this.news;
    }
}

module.exports = Display;