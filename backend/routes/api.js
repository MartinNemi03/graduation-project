const express = require("express");
const router = express.Router();

const mongo = require('../db/mongo');
const queue = require('../queue');

const handleError = (e, res) => {
    console.error(e);

    res.status(500).json({
        success: false,
        error: e.toString()
    });
};

router.get('/slides/current', async (req, res) => {
    try {
        let slide = await require('../main').getCurrentSlide();
        if (!slide) throw "No current slide is available.";

        res.json({
            success: true,
            slide: slide
        });
    } catch (e) {
        handleError(e, res);
    }
});

router.get('/slides/upcoming', async (req, res) => {
    try {
        let result = await require('../queue').getUpcomingSlide();
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

router.get('/queue/current/list', async (req, res) => {
    try {
        let result = require('../queue').getCurrent();
        res.json(result);
    } catch (e) {
        handleError(e, res);
    }
});

router.get('/queue/default/list', async (req, res) => {
    try {
        let result = await require('../queue').getDefault();
        res.json(result);
    } catch (e) {
        handleError(e, res);
    }
});

router.use(require('../auth'));

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
        queue.updateCurrent(newQueue);

        res.json({
            success: true,
            queue: newQueue
        });
    } catch (e) {
        handleError(e, res);
    }
});

router.post('/queue/default/update', async (req, res) =>{
    try {
        const newQueue = req.body;
        queue.updateDefault(newQueue);

        res.json({
            success: true,
            queue: newQueue
        });
    } catch (e) {
        handleError(e, res);
    }
});

module.exports = router;