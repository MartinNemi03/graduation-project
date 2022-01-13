const express = require("express");

const path = require("path");
const router = express.Router();

router.use(require('../auth'));

router.use('/', express.static('frontend/dashboard/public'));

router.get('/*', (req, res) => {
    res.sendFile(path.resolve('./frontend/dashboard', 'index.html'));
});

module.exports = router;