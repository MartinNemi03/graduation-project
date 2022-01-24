const express = require("express");
const router = express.Router();

const mongo = require('../db/mongo');

const handleError = (e, res) => {
    console.error(e);

    res.status(500).json({
        success: false,
        error: e.toString()
    });
};

router.get('/slides/current', (req, res) => {
    try {
        let slide = require('../main').getCurrentSlide();
        if (!slide) throw "No current slide is available.";

        res.json({
            success: true,
            slide: slide
        });
    } catch (e) {
        handleError(e, res);
    }
});

router.get('/slides/next', (req, res) => {
    // TODO: Return next slide if possible
});

router.get('/slides/queue', (req, res) => {
    // TODO: Return the entite slide queue
});

router.get('/slides/list', async (req, res) => {
    try {
        let result = await mongo.getSlides();

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

router.post('/slides/remove', async (req, res) => {
    try {
        let result = await mongo.removeSlide(req.id);

        res.json(result);
    } catch (e) {
        handleError(e, res);
    }
});

module.exports = router;