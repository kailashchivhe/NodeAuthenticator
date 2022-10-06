const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Item = new Schema({
    name: {
        type: String
    },
    discount: {
        type: Number
    },
    photo: {
        type: String
    },
    price: {
        type: Number
    },
    region: {
        type: String
    }
});

module.exports = mongoose.model('items', Item);