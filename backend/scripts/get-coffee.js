const fetch = require("node-fetch");

module.exports = {
    getCoffee: () => {
        return new Promise((resolve) => {
            fetch('https://coffee.alexflipnote.dev/random.json', {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'GET'
            }).then((req) => {
                if (req.status !== 200) resolve(null);
                else req.json().then((res) => {
                    resolve(res.file);
                });
            });
        });
    }
};