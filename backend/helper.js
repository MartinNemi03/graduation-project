const path = require('path');
const fs = require('fs');

const cacheFolder = path.resolve('./backend/cache');
const checkCacheFolder = () => {
    try {
        if (!fs.existsSync(cacheFolder))
            fs.mkdirSync(cacheFolder);
    } catch (e) {
        console.error(e);
    }
};

const readJson = (filePath) => {
    if (fs.existsSync(filePath))
        return JSON.parse(fs.readFileSync(filePath));
    else return null;
};

const saveJson = (filePath, fileData) => {
    return fs.writeFileSync(filePath, JSON.stringify(fileData));
};

module.exports = {
    checkCacheFolder,
    readJson,
    saveJson
};

checkCacheFolder();