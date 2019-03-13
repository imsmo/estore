const mongoose = require('./connection');

const FaqModel = new mongoose.Schema({
	question: {
		type: String,
		required: true
    },
    answer: {
        type: String,
        required: true
    },
    created_at:{
        type: String
    }
});


module.exports = mongoose.model('Faq', FaqModel);