const mongoose = require('./connection');

const ProductModel = new mongoose.Schema({
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'brand',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    no_products: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: true
    },
    e_credit: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        required: true
    },
    specification: {
        type: String
    },
    height: {
        type: Number
    },
    width: {
        type: Number
    },
    length: {
        type: Number
    },
    weight: {
        type: Number
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now()
    }
});

const Product = mongoose.model('product',ProductModel);

module.exports = Product;