const path = require('path');
const fs = require('fs');

let typesLoaded = false;
let typesError = false;

const slideTypes = {};

const handleError = (e) => {
    console.error(e);

    return {
        success: false,
        error: e.toString()
    };
};

const loadTypes = async () => {
    try {
        console.log("Loading types..");

        const typesPath = path.resolve("./frontend/display/src/slides");
        fs.readdirSync(typesPath).forEach((file) => {
            if (path.parse(file).ext === ".svelte") {
                let typeName = path.parse(file)?.name.toLocaleLowerCase();
                let typePath = path.resolve(`${typesPath}/${file}`);

                slideTypes[typeName] = typePath;
                console.log(`Type ${typeName} loaded!`);
            } else console.error(`Unknown file ${file} was found in /frontend/display/src/slides`);
        });

        typesLoaded = true;
        console.log("All types were loaded!");
    } catch (e) {
        typesError = true;
        return handleError(e);
    }
};

const waitForLoad = () => {
    return new Promise((resolve) => {
        let int = setInterval(() => {
            if (typesLoaded) {
                clearInterval(int);
                resolve();
            }
        }, 100);
    });
};

module.exports = {
    render: async (type = "", data = {}) => {
        try {
            if (typesError) throw "There was an error while loading slide types.";
            if (!typesLoaded) await waitForLoad();

            require('svelte/register');
            let component = require(slideTypes[type]).default;

            switch (type) {
                case "coffee":
                    data.coffee = await require('./get-coffee').getCoffee();
                    break;
            }

            let render = component.render({ data: data });
            render.type = type;
            render.time = Date.now();

            return {
                success: true,
                render: render
            };
        } catch (e) {
            return handleError(e);
        }
    }, getSlideTypes: async () => {
        try {
            if (typesError) throw "There was an error while loading slide types.";
            if (!typesLoaded) await waitForLoad();

            return {
                success: true,
                types: slideTypes
            };
        } catch (e) {
            return handleError(e);
        }
    }
};

loadTypes();