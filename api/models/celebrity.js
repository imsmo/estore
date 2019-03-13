const mongoose = require('./connection');

const CelebrityModal = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    brands: [{
        type: String,
        required: true
    }],
    products: [{
        type: String,
        required: true
    }],
    photo: {
        type: String,
        required: true
    },
    created_at: {
		type: Date,
        required: true,
        default: Date.now()
    }
});

const Celebrity = mongoose.model('celebrity', CelebrityModal);

module.exports = Celebrity;