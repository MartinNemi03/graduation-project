const main = require('./main');
const helper = require('./helper');

const moment = require('moment');
const path = require('path');

let rawNews = [];
let parsedNews = [];

let newsLoading = false;
let newsLoaded = false;
let newsParsed = false;

const newsPath = path.resolve('./backend/cache/news-raw.json');
const defaultNews = [
    `Dneska je %%weekday_name%%.`
];

const variables = {
    weekday_name: () => { 
        moment.locale('cs');
        return moment().format('dddd'); 
    },
    temperature: () => {
        // Zde akorát získat teplotu
        return '45.90°C';
    } 
};

const variableRegex = new RegExp('%%.*?%%', 'g');
const parseVariables = (news) => {
    try {
        newsParsed = false;
        let toBeParsed = JSON.parse(JSON.stringify(news));

        for (let i = 0; i < toBeParsed.length; i++) {
            let line = toBeParsed[i];

            regexVar = line.matchAll(variableRegex);
            for (let parseVarArr of regexVar) {
                let parseVar = parseVarArr[0].replaceAll('%', '');
                for (const variable in variables) {
                    if (parseVar === variable)
                        line = line.replace(parseVarArr[0], variables[variable]());
                }
            }

            toBeParsed[i] = line;
        }

        newsParsed = true;
        return toBeParsed;
    } catch (e) {
        console.error(e);
        return [];
    }
};

const handleError = (e) => {
    console.error(e);
    return {
        success: false,
        error: e.toString()
    };
};

const loadNews = () => {
    try {
        newsLoading = true;

        console.log(`Loading news..`);

        rawNews = helper.readJson(newsPath);
        rawNews = rawNews ? rawNews : [];

        for (let i = 0; i < defaultNews.length; i++)
            rawNews[i] = defaultNews[i];
        helper.saveJson(newsPath, rawNews);

        parsedNews = parseVariables(rawNews);

        newsLoading = false;
        newsLoaded = true;

        console.log(`News loaded!`);
        main.updateCurrentNews(parsedNews);
    } catch (e) {
        console.error(e);
    }
};

const saveNews = () => {
    try {
        console.log(`Saving news..`);

        helper.saveJson(newsPath, rawNews);

        console.log(`News saved!`);
    } catch (e) {
        console.error(e);
    }
};

const waitFor = {
    load: () => {
        return new Promise((resolve) => {
            int = setInterval(() => {
                if (newsLoaded) {
                    clearInterval(int);
                    resolve();
                }
            }, 100);
        });
    },
    parse: () => {
        return new Promise((resolve) => {
            int = setInterval(() => {
                if (newsParsed) {
                    clearInterval(int);
                    resolve();
                }
            }, 100);
        });
    }
};

module.exports = {
    getRawNews: async () => {
        try {
            if (newsLoading) return;
            if (!newsLoaded) await waitFor.load();

            return {
                success: true,
                raw: rawNews
            };
        } catch (e) {
            return handleError(e);
        }
    },
    getParsedNews: async () => {
        try {
            if (newsLoading) return;
            if (!newsLoaded) await waitFor.load();
            if (!newsParsed) await waitFor.parse();

            return {
                success: true,
                parsed: parsedNews
            };
        } catch (e) {
            return handleError(e);
        }
    },
    updateNews: async (newNews) => {
        try {
            rawNews = newNews;
            helper.saveJson(newsPath, rawNews);

            parsedNews = await parseVariables(rawNews);
            main.updateCurrentNews(parsedNews);

            return {
                success: true,
                raw: rawNews,
                parsed: parsedNews
            };
        } catch (e) {
            return handleError(e);
        }
    }
};

setInterval(() => {
    if (!newsParsed) return;

    parsedNews = parseVariables(rawNews);
    main.updateCurrentNews(parsedNews);
}, (30 * 60 * 1000));
setInterval(saveNews, (10 * 60 * 1000));

loadNews();