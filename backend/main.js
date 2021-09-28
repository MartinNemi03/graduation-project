const express = require("express");
const uuid = require("uuid");

const app = express();
const port = 32565;

const ws = require('express-ws')(app);

app.get('*', (req, res, next) => {
    console.log(`${req.ip} - ${req.url} `);
    next();
});

app.use('/display', require("./routes/display"));

app.listen(port, '0.0.0.0', () => {
    console.log(`Web server was started at http://localhost:${port}`);
});





