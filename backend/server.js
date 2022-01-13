const express = require('express');
const session = require("express-session");
const bodyParser = require('body-parser');
const uuid = require("uuid");

const app = express();
const port = 32565;
const wss = require('express-ws')(app);

app.use(session({ 
    secret: uuid.v4(),
    resave: false,
    saveUninitialized: false
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('*', (req, res, next) => {
    console.log(`${req.ip} - ${req.method} ${req.url}`);
    next();
});

app.use('/api', require("./routes/api"));

app.use('/dashboard', require("./routes/dashboard"));

app.use('/display', require("./routes/display"));

app.listen(port, '0.0.0.0', () => {
    console.log(`Web server was started at http://localhost:${port}`);
});
