const { MongoClient } = require('mongodb');
const uuid = require('uuid');

const mongo = new MongoClient(process.env.MONGO_URL, { useUnifiedTopology: true });
let db;

const startMongo = async (mongo) => {
    await mongo.connect();
    db = mongo.db(process.env.MONGO_NAME);
};

const handleError = (e) => {
    console.error(e);

    return {
        success: false,
        error: e.toString()
    };
};

module.exports = {
    db: db,
    getSlide: async (id) => {
        try {
            let slideDoc = await db.collection('slides').findOne({ _id: id });

            if (!slideDoc)
                throw "No slide was found.";

            return {
                success: true,
                slide: slideDoc
            };
        } catch (e) {
            return handleError(e);
        }
    },
    addSlide: async (type = "unknown", data = {}) => {
        try {
            let slideDoc = {
                _id: uuid.v4().slice(0, 8),
                timestamp: new Date().getTime(),
                slide: {
                    type: type,
                    data: data
                }
            };

            await db.collection('slides').insertOne(slideDoc);

            return {
                success: true,
                slide: slideDoc
            };
        } catch (e) {
            return handleError(e);
        }
    },
    deleteSlide: async (id) => {
        try {
            await db.collection('slides').deleteOne({ _id: id });

            return {
                success: true,
                removed_id: id
            };
        } catch (e) {
            return handleError(e);
        }
    },
    getSlides: async (limit = 0) => {
        try {
            let slideList = [];
            let query = await db.collection('slides').find().limit(limit);

            while (await query.hasNext()) {
                const slide = await query.next();
                slideList = slideList.concat(slide);
            }

            return {
                success: true,
                slides: slideList
            };
        } catch (e) {
            return handleError(e);
        }
    }
};

startMongo(mongo);