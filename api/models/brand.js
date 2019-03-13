const mongoose = require('./connection');

const BrandModal = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    banner: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    created_at: {
		type: Date,
        required: true,
        default: Date.now()
    }
});

const Brand = mongoose.model('brand', BrandModal);

module.exports = Brand;