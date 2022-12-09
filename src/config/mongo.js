const mongoose = require('mongoose');

const {
    MONGO_USERNAME= process.env.MONGO_DB_USERNAME,
    MONGO_PASSWORD= process.env.MONGO_DB_PASSWORD,
    MONGO_HOST= process.env.MONGO_DB_HOST,
    MONGO_DATABASE= process.env.MONGO_DB_DATABASE,
} = process.env;

const MONGO_URI = `mongodb+srv://${MONGO_USERNAME}:${encodeURIComponent(MONGO_PASSWORD)}@${MONGO_HOST}/${MONGO_DATABASE}`;

const MONGO_OPTIONS = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

//Connect to db
mongoose.connect(
    //process.env.DB_CONNECT,
    MONGO_URI,
    MONGO_OPTIONS,
    () => { console.log("Connected to mongodb"); }
);

// get reference to database
var mongo_db = mongoose.connection;
mongo_db.on('error', console.error.bind(console, 'connection error:'));

module.exports.mongo_db = mongo_db;