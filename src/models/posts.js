const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    pictures: {
        type: [String],
        required: false
    },
    likes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Post', postSchema);