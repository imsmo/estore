const mongoose = require('./connection');
const config = require('../../config');

const UserModel = new mongoose.Schema({

    full_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    country_code: {
        type: Number,
    },
    mobile_no: {
        type: String,
        maxlength: 12
    },
    gender: {
        type: String,
        enum: config.genderArray,
        required: true
    },
    password: {
        type: String,
        min: 6,
        required: true
    },
    account_type: {
        type: String,
        enum: config.registerType,
        required: true
    },
    device_type: {
        type: String,
        enum: config.deviceType
    },
    active: {
        type: Boolean,
        default: true
    },
    created_at: {
		type: Date,
        required: true,
        default: Date.now()
    },
    otp_verified: {
		type: Boolean,
		default: false
    },
    otp: {
		value: {
			type: String
		},
		expired_at: {
			type: String
		}
    },
    tokens: {
		access: {
			type: String,
			required: true
		},
		token: {
			type: String,
			required: true
		},
		firebase_token: {
			type: String
		}
    },
    favorite: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product'
    }],

    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product'
    }],

    shipping_address: [{
        full_name: {
            type: String
        },
        country: {
            type: String
        },
        area: {
            type: String
        },
        block: {
            type: String
        },
        street: {
            type: String
        },
        avenue: {
            type: String
        },
        floor_no: {
            type: String
        },
        flat_no: {
            type: String
        },
        country_code: {
            type:String
        },
        phone_no: {
            type: String
        },
        notes: {
            type: String
        },
        building_no: {
            type: String
        },
        is_default: {
            type: String,
            default: false
        }

    }],

    my_box: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product' 
        },
        shipping_charges: {
            type: String
        }
    }]
});

const User = mongoose.model('user', UserModel);

module.exports = User
