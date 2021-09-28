const express = require("express");
const path = require("path");
const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(path.resolve('./frontend/display', 'index.html'));
});

router.use('/', express.static('frontend/display/public'));

module.exports = router;