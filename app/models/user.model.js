const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
    email: {
        type: String
    },
    password: {
        type: String
    },
    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
});

module.exports = mongoose.model('users', User);