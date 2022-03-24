const express = require("express");
const router = express.Router();

const mongo = require('../db/mongo');
const queue = require('../queue');
const main = require('../main');
const news = require('../news');

const handleError = (e, res) => {
    console.error(e);

    res.status(500).json({
        success: false,
        error: e.toString()
    });
};

router.get('/slides/current', async (req, res) => {
    try {
        let result = await main.getCurrentSlide();
        res.json(result);
    } catch (e) {
        handleError(e, res);
    }
});

router.get('/slides/upcoming', async (req, res) => {
    try {
        let result = await queue.getUpcomingSlide();
        res.json(result);
    } catch (e) {
        handleError(e, res);
    }
});

router.get('/slides/list', async (req, res) => {
    try {
        let result = await mongo.getSlides();
        res.json(result);
    } catch (e) {
        handleError(e, res);
    }
});

router.get('/slides/types', async (req, res) => {
    try {
        let result = await require('../scripts/render-slide').getSlideTypes();
        res.json(result);
    } catch (e) {
        handleError(e, res);
    }
});

router.get('/queue/current/list', async (req, res) => {
    try {
        let result = await queue.getCurrent();
        res.json(result);
    } catch (e) {
        handleError(e, res);
    }
});

router.get('/queue/default/list', async (req, res) => {
    try {
        let result = await queue.getDefault();
        res.json(result);
    } catch (e) {
        handleError(e, res);
    }
});

router.get('/news/current', async (req, res) => {
    try {
        let result = await main.getCurrentNews();
        res.json(result);
    } catch (e) {
        handleError(e, res);
    }
});

router.use(require('../auth'));

router.get('/ping', async (req, res) => {
    try { 
        res.header("X-Username", process.env.DASHBOARD_USERNAME);
        res.json({ success: true, pong: "Pong!" }); 
    } catch (e) { handleError(e, res); }
});

router.get('/slides/:id', async (req, res) => {
    try {
        let id = req.params.id;
        if (!id) throw "No slide ID specified.";

        let result = await mongo.getSlide(id);

        res.json(result);
    } catch (e) {
        handleError(e, res);
    }
});

router.post('/slides/add', async (req, res) => {
    try {
        const slide = req.body;
        let result = await mongo.addSlide(slide.type, slide.data);

        res.json(result);
    } catch (e) {
        handleError(e, res);
    }
});

router.post('/slides/delete', async (req, res) => {
    try {
        let result = await mongo.deleteSlide(req.body.id);

        res.json(result);
    } catch (e) {
        handleError(e, res);
    }
});

router.post('/queue/current/update', async (req, res) =>{
    try {
        const newQueue = req.body;
        const result = queue.updateCurrent(newQueue);

        if (!result.success) throw result.error;

        res.json({
            success: true,
            queue: result.queue
        });
    } catch (e) {
        handleError(e, res);
    }
});

router.post('/queue/default/update', async (req, res) => {
    try {
        const newQueue = req.body;
        const result = queue.updateDefault(newQueue);

        if (!result.success) throw result.error;

        res.json({
            success: true,
            queue: result.queue
        });
    } catch (e) {
        handleError(e, res);
    }
});

router.get('/news/raw', async (req, res) => {
    try {
        let result = await news.getRawNews();
        res.json(result);
    } catch (e) {
        handleError(e, res);
    }
});

router.get('/news/parsed', async (req, res) => {
    try {
        let result = await news.getParsedNews();
        res.json(result);
    } catch (e) {
        handleError(e, res);
    }
});

router.post('/news/update', async (req, res) => {
    try {
        const newNews = req.body;
        const result = await news.updateNews(newNews);

        console.log(result);
        if (!result.success) throw result?.error;
        res.json(result);
    } catch (e) {
        handleError(e, res);
    }
});

router.get('/display/list', async (req, res) => {
    try {
        let result = await require('../main').getDisplays();
        res.json(result);
    } catch (e) {
        handleError(e, res);
    }
});

module.exports = router;