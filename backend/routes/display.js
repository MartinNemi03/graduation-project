const express = require("express");
const path = require("path");
const { addDisplay } = require("../main");
const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(path.resolve('./frontend/display', 'index.html'));
});

router.use('/', express.static('frontend/display/public'));

router.ws('/', (ws, req) => {
    console.log(`${req.ip} - WS OPEN`);
    ws = addDisplay(ws, {
        ip: req.ip,
        user_agent: req.headers["user-agent"],
        join_timestamp: Date.now()
    });

    ws.on('message', (data) => {
        console.log(`${req.ip} - WS MSG: ${data}`);
    });

    ws.on('close', (code, err) => {
        console.log(`${req.ip} - WS CLOSE`);
        require('../main').removeDisplay(ws.id);
    });
});

module.exports = router;