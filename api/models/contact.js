const mongoose = require('./connection');

const ContactModal = new mongoose.Schema({

    email: {
        type: String
    },

    phone_no: {
        type: String
    },

    follow_us: {
        facebook: {
            type: String
        },
        instagram: {
            type: String
        },
        youtube: {
            type: String
        },
        twitter: {
            type: String
        },
        google_plus: {
            type: String
        }
    },

    queries: [{
        name: {
            type: String
        },
        email: {
            type: String
        },
        phone: {
            type: String
        },
        comments: {
            type: String
        },
        created_at: {
            type: Date,
            required: true,
            default: Date.now()
        }
    }]
});

const Brand = mongoose.model('contact', ContactModal);

module.exports = Brand;