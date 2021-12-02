const express = require("express");
const router = express.Router();

router.get('/slides/current', (req, res) => {
    // TODO: Return current slide
});

router.get('/slides/next', (req, res) => {
    // TODO: Return next slide
});

router.get('/slides/queue', (req, res) => {
    // TODO: Return the entite slide queue
});

module.exports = router;