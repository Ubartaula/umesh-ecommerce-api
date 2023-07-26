const mongoose = require("mongoose");

const connectMongoDb = mongoose.connect(process.env.DATABASE_URI);

module.exports = connectMongoDb;
