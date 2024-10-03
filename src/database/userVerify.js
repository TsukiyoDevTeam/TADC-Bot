const mongoose = require("mongoose");

const notes = new mongoose.Schema({
    User: String,
    Message: String,
    Time: String
});

const Schema = new mongoose.Schema({
    User: String,
    Time: String,
    Verified: {
        type: Boolean,
        default: false
    },
    IPAddress: String,
    Email: String,

    Note: [notes]
});

const model = mongoose.model('tadcverify', Schema);
module.exports = model;
