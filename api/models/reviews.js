const mongoose = require('../models/connection');

const ReviewModel = new mongoose.Schema({
    
    celebrity: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'celebrity',
        required: true
    },

    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'brand',
        required: true
    },

    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: true
    },

    review: {
        type: String,
        required: true
    },

    rating: {
        type: Number,
        min: 0,
        max: 5,
        required: true
    },

    video_cover: {
        type: String,
        required: true
    },

    video: {
        type: String,
        required: true
    },

    views_count: {
        type: Number,
        default: 0
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
});

const Review = mongoose.model('reviews', ReviewModel);

module.exports = Review;