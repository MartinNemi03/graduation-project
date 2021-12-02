const auth = (req, res, next) => { // Auth
    let header = req.headers.authorization;

    let e = new Error('Nejste přihlášen.');
    e.status = 401;

    if (!header) {
        res.setHeader('WWW-Authenticate', 'Basic');
        return next(e);
    }

    let data = new Buffer.from(header.split(' ')[1], 'base64').toString().split(':');

    // TODO: Add login checks via mongo
    if (data[0] == "admin" && data[1] == "admin") {
        next();
    } else {
        res.setHeader('WWW-Authenticate', 'Basic');
        return next(e);
    }
};

module.exports = auth;