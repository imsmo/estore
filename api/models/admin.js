const mongoose = require('./connection');

var config = require('./../../config');


const AdminModel = new mongoose.Schema({
    first_name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String
    },
    // is_active:{
    //     type: Boolean,
    //     default: true
    // },
    // is_deleted:{
    //     type: Boolean,
    //     default: false
    // },
	// tokens: [{
	// 	access: {
	// 		type: String,
	// 		required: true
	// 	},
	// 	token: {
	// 		type: String,
	// 		required: true
	// 	}
    // }]
}, {
    usePushEach: true 
})

const Admin =  mongoose.model('admin', AdminModel);

module.exports = Admin;