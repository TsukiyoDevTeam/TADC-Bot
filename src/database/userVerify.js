const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
    User: String,
    Time: String,
    Verified: {
        type: Boolean,
        default: false
    },
    IPAddress: String,
    Email: String
});

const model = mongoose.models.userVerify || mongoose.model('userVerify', Schema);

module.exports = model;