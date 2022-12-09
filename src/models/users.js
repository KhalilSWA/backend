const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    password: {
        type: String,
        required: false,
        min: 6,
        max: 1024
    },
    phone: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    picture: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);