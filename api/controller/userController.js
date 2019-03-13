const _ = require('lodash');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const localization = require('../service/localization');
const Service = require('../service');
const Sms = require('../service/sms');
const config = require('../../config');


module.exports = {

    register: async (req, res) => {
        try {
            const params = _.pick(req.body, ['full_name', 'email', 'password', 'gender', 'account_type', 'device_type', 'mobile_no', 'firebase_token', 'country_code']);
            console.log('Register Request :: ', params);
            if(_.isEmpty(params.full_name) ||
                _.isEmpty(params.email) ||
                _.isEmpty(params.password) ||
                _.isEmpty(params.gender) ||
                _.isEmpty(params.device_type) ||
                _.isEmpty(params.account_type) ||
                _.isElement(params.firebase_token) ||
                _.isEmpty(params.country_code) ||
                _.isEmpty(params.mobile_no)) {
                return res.status(200).json(Service.response(0, localization.missingParamError, null));
            }
            if(!Service.validateEmail(params.email)) {
                return res.status(200).json(Service.response(0, localization.emailValidationError, null));
            }
            if(params.password.trim().length < 6 || params.password.trim().length > 20) {
               return res.status(200).json(Service.response(0, localization.passwordValidationError, null));
            }
        
            if(params.gender.trim() != 'male' && params.gender.trim() != 'female') {
                return res.status(200).json(Service.response(0, localization.genderValidationError, null));
            }
            if(params.device_type.trim() != 'ios' && params.device_type.trim() != 'android') {
                return res.status(200).json(Service.response(0, localization.deviceTypeValidationError, null));
            }
            if(params.account_type.trim() != 'facebook' && params.account_type.trim() != 'email') {
                return res.status(200).json(Service.response(0, localization.accountTypeValidationError, null));
            }
            if(isNaN(params.mobile_no) || params.mobile_no.trim().length != 10) {
                return res.status(200).json(Service.response(0, localization.mobileValidationError, null));
            }

            const us = await User.findOne({
				'email': params.email.trim()
            });
            if(us) {
                return res.status(200).json(Service.response(0, localization.emailExistError, null));
            }

            const mo = await User.findOne({
				'mobile_no': params.mobile_no
            });
            if(mo) {
                return res.status(200).json(Service.response(0, localization.mobileExistError, null));
            }

            const hash = bcrypt.hashSync(params.password);

            const otpGenerate = await Service.generateOtp(params);

            if (!otpGenerate.status) {
                return res.status(200).json(Service.response(0, localization.otpGenerateError, null));
            }
            
            // await Sms.sendOTP(params.mobile_no, otpGenerate.otp);

            const token = await Service.issueToken(params);
        
            const user = new User({
                'full_name': params.full_name.toLowerCase(),
                'email': params.email,
                'password': hash,
                'gender': params.gender,
                'account_type': params.account_type,
                'device_type': params.device_type,
                'mobile_no': params.mobile_no,
                'country_code': params.country_code,
                'otp': {
					'value': otpGenerate.otp,
					'expired_at': new Date().getTime() + (config.OPT_EXPIRED_IN_MINUTES * 60 * 1000)
                },
                'tokens': {
                    'access': params.device_type.toLowerCase(),
                    'token': token,
                    'firebase_token': params.firebase_token ? params.firebase_token : 'FAKETOKEN'
                }
            });

            const rez = await user.save();

            if(!rez) {
                res.status(200).json(Service.response(0, localization.ServerError, null));    
            }

            resObj = {
                'id': rez._id,
                'full_name': _.capitalize(rez.full_name),
                'email': rez.email,
                'gender': rez.gender,
                'active': rez.active,
                'account_type': rez.login_type,
                'created_at': await Service.readableDate(rez.created_at),
                'token': token,
                'account_type': rez.account_type
            }

            res.status(200).json(Service.response(1, localization.Success, resObj));
        } catch (err) {
            res.status(200).json(Service.response(0, localization.ServerError, err.message));
        }

    },

    login: async (req, res) => {
        try {
            const params = _.pick(req.body, ['email', 'password']);
            console.log('Login Request ::', params);

            if(_.isEmpty(params.email) || _.isEmpty(params.password)) {
                return res.status(200).json(Service.response(0, localization.missingParamError, null));
            }
            if(!Service.validateEmail(params.email)) {
                return res.status(200).json(Service.response(0, localization.emailValidationError, null));
            }

            const us = await User.findOne({ 'email': params.email });

            if(!us) {
                return res.status(200).json(Service.response(0, localization.AccountError, null));
            }

            const isValid = await bcrypt.compare(params.password, us.password);

            if(!isValid) {
                return res.status(200).json(Service.response(0, localization.invalidCredentials, null));
            }

            if(!us.active) {
                return res.status(200).json(Service.response(0, localization.accountDeactivated, null));
            }

            // if(!us.otp_verified) {
            //     return res.status(200).json(Service.response(0, localization.mobile_unverified, null));
            // }

            const token = await Service.issueToken(params);
            us.tokens.token = token;
            await us.save();

            const resObj = {
                'id': us._id,
                'email': us.email,
                'account_type': us.account_type,
                'otp_verified': _.toString(us.otp_verified),
                'active': _.toString(us.active),
                'device_type': us.device_type,
                'token': token,
                'gender': us.gender,
                'mobile_no': us.mobile_no,
                'country_code':"+" +  _.toString(us.country_code),
                'full_name': _.capitalize(us.full_name),
                'created_at': await Service.formateDate(us.created_at),
                'favourite': us.favorite,
                'shipping_address': us.shipping_address,
                'my_box': us.my_box
            }
            res.status(200).json(Service.response(1, localization.Success, resObj));

        } catch (err) {
            res.status(200).json(Service.response(0, localization.ServerError, err.message));
        }
    },

    changePassword: async (req, res) => {
        try {
            const params = _.pick(req.body, ['old_pass', 'new_pass']);

            if(_.isEmpty(params.old_pass) || _.isEmpty(params.new_pass)) {
                return res.status(200).json(Service.response(0, localization.missingParamError, null)); 
            }

            if(params.new_pass.length < 6 || params.new_pass.length > 20) {
                return res.status(200).json(Service.response(0, localization.passwordValidationError, null));
            }

            if(params.old_pass == params.new_pass) {
                return res.status(200).json(Service.response(0, localization.oldAndnewPassnotsame, null));
            }

            const rez = await bcrypt.compare(params.old_pass, req.user.password);

            if(!rez) {
                return res.status(200).json(Service.response(0, localization.invalidCredentials, null));
            }
            const hash = bcrypt.hashSync(params.new_pass);

            req.user.password = hash;

            const user = await req.user.save();

            if(!user) {
                return res.status(200).json(Service.response(0, localization.ServerError, null));
            }
            res.status(200).json(Service.response(1, localization.changePasswordSuccess, null));
        } catch (err) {
            res.status(200).json(Service.response(0, localization.ServerError, err.message));
        }
    },

    verifyOTP: async (req, res) => {
        try {
            const params = _.pick(req.body, ['otp']);
            if(_.isEmpty(params.otp)) {
                return res.status(200).json(Service.response(0, localization.missingParamError, null)); 
            }
            if(req.user.otp.value !== params.otp) {
                return res.status(200).json(Service.response(0, localization.inValidOTP, null));
            }
            if (req.user.otp.expired_at < new Date().getTime()) {
                return res.status(200).json(Service.response(0, localization.otpExpired, null));
            }
            req.user.otp_verified = true;
            req.user.otp.value = "";
            req.user.otp.expired_at = 0;

            const us = await req.user.save();

            if(!us) {
                return res.status(200).json(Service.response(0, localization.ServerError, null));
            }

            res.status(200).json(Service.response(1, localization.loginSuccess, {'token': req.body.token}));
				
        } catch (err) {
            res.status(200).json(Service.response(0, localization.ServerError, err.message)); 
        }
    },
    sendOTP: async (req, res) => {
        try {
            const otp = await Service.generateOtp(req.user);
            if (!otp.status) {
                return res.status(200).json(Service.response(0, localization.otpGenerateError, null));
            }
            //await Sms.sendOTP(req.user.mobile_no, otp);

            req.user.otp.value = otp.otp;
            req.user.otp.expired_at = new Date().getTime() + (config.OPT_EXPIRED_IN_MINUTES * 60 * 1000);
            
            const us = await req.user.save(); 

            if(!us) {
                return res.status(200).json(Service.response(0, localization.ServerError, null));
            }
            res.status(200).json(Service.response(1, localization.OtpSent, null));	
        } catch (err) {
            res.status(200).json(Service.response(0, localization.ServerError, err.message)); 
        }
    },

    addFavorite: async (req, res) => {
        try {
            const params = _.pick(req.body, ['id']);

            if(_.isEmpty(params.id)) {
                return res.status(200).json(Service.response(0, localization.missingParamError, null));
            }

            if(!Service.validateObjectId(params.id)) {
                return res.status(200).json(Service.response(0, localization.invalidObjectIdError, null));
            }

            const user = await User.findById(req.user._id);
            
            let exists = false;

            await user.favorite.filter((f) => {
                if(f._id == params.id) {
                   return exists = true;
                } 
                return exists = false;
            });

            if(!exists) {
                user.favorite.push(params.id);
            }

            const rez = await user.save();;

            if(!rez) {
                res.status(200).json(Service.response(0, localization.ServerError, null));    
            }
            res.status(200).json(Service.response(1, localization.addProductToFavourite, null));

        } catch (err) {
            res.status(200).json(Service.response(0, localization.ServerError, err.message));
        }
    },

    removeFavorite: async (req, res) => {
        try {
            const params = _.pick(req.body, ['id']);

            if(_.isEmpty(params.id)) {
                return res.status(200).json(Service.response(0, localization.missingParamError, null));
            }

            if(!Service.validateObjectId(params.id)) {
                return res.status(200).json(Service.response(0, localization.invalidObjectIdError, null));
            }

            const user = await User.findById(req.user._id);
            
            let exists = false;

            await user.favorite.filter((f) => {
                if(f._id == params.id) {
                   return exists = true;
                } 
                return exists = false;
            });

            if(exists) {
                user.favorite.splice(params.id, 1);
            }

            const rez = await user.save();

            if(!rez) {
                res.status(200).json(Service.response(0, localization.ServerError, null));    
            }
            res.status(200).json(Service.response(1, localization.removeProductToFavourite, null));

        } catch (err) {
            res.status(200).json(Service.response(0, localization.ServerError, err.message));
        }
    },

    listFavourite: async (req, res) => {
        try {
            const list = await User.findById(req.user._id, 'email full_name').populate('favorite', 'price name image');
            console.log(list);
            if(!list) {
                return res.status(200).json(Service.response(0, localization.ServerError, null));
            }
            const fl = await Promise.all(list.favorite.map(async l => {
                return {
                    'id': l._id,
                    'name': _.capitalize(l.name),
                    'price': _.toString(l.price),
                    'image': l.image
                }
            }));
            const finalobj = {
                'id': list._id,
                'name': _.capitalize(list.full_name),
                'email': list.email,
                'favorites': fl
            }
            res.status(200).json(Service.response(1, localization.Success, finalobj));
        } catch (err) {
            res.status(200).json(Service.response(0, localization.ServerError, err.message));
        }
    },

    addShippingAddress: async (req, res) => {
        try {
            const params = _.pick(req.body, ['full_name', 'country', 'area', 'block', 'street', 'avenue', 'building_no' ,'floor_no', 'flat_no', 'country_code','phone_no', 'notes']);

            if(_.isEmpty(params.full_name) ||
                _.isEmpty(params.country) ||
                _.isEmpty(params.area) ||
                _.isEmpty(params.block) ||
                _.isEmpty(params.street) ||
                _.isEmpty(params.building_no) ||
                _.isEmpty(params.phone_no) ||
                _.isEmpty(params.country_code)) {
                return res.status(200).json(Service.response(0, localization.missingParamError, null));
            }

            if(_.isNaN(params.floor_no) || 
                _.isNaN(params.country_code) || 
                _.isNaN(params.flat_no) ||
                _.isNaN(params.phone_no)) {
                return res.status(200).json(Service.response(0, localization.missingParamError, null));
            }

            if(params.phone_no.length != 10) {
                return res.state(200).json(Service.response(0, localization.mobileValidationError), null);
            }

            const user = await User.findById(req.user.id, 'shipping_address');

            if(!user) {
               return res.status(200).json(Service.response(0, localization.ServerError, null));
            }

            user.shipping_address.push(params);

            const result = await user.save();

            if(!result) {
                return res.status(200).json(Service.response(0, localization.missingParamError, null));
            }

            res.status(200).json(Service.response(1, localization.addShippingAddress, null));

        } catch (err) {
            res.status(200).json(Service.response(0, localization.ServerError, err.message));
        }
    },

    updateShippingAddress: async (req, res) => {
        try {
            const params = _.pick(req.body, ['id','full_name', 'country', 'area', 'block', 'street', 'avenue', 'building_no' ,'floor_no', 'flat_no', 'country_code','phone_no', 'notes', 'is_default']);

            if(_.isEmpty(params.full_name) ||
                _.isEmpty(params.country) ||
                _.isEmpty(params.area) ||
                _.isEmpty(params.block) ||
                _.isEmpty(params.street) ||
                _.isEmpty(params.building_no) ||
                _.isEmpty(params.phone_no) ||
                _.isEmpty(params.country_code) ||
                _.isEmpty(params.id)) {
                return res.status(200).json(Service.response(0, localization.missingParamError, null));
            }

            if(!Service.validateObjectId(params.id)) {
                return res.status(200).json(Service.response(0, localization.invalidObjectIdError, null));
            }

            if(_.isNaN(params.floor_no) || 
                _.isNaN(params.country_code) || 
                _.isNaN(params.flat_no) ||
                _.isNaN(params.phone_no)) {
                return res.status(200).json(Service.response(0, localization.missingParamError, null));
            }

            if(params.phone_no.length != 10) {
                return res.status(200).json(Service.response(0, localization.mobileValidationError, null));
            }
            console.log('Update Shipping Request Update',params);

            const user = await User.findOneAndUpdate({
                '_id': req.user.id,
                'shipping_address._id': params.id
            }, {
                $set:{
                   'shipping_address.$.full_name': params.full_name,
                   'shipping_address.$.country': params.country,
                   'shipping_address.$.area': params.area,
                   'shipping_address.$.block': params.block,
                   'shipping_address.$.street': params.street,
                   'shipping_address.$.avenue': params.avenue,
                   'shipping_address.$.building_no': params.building_no,
                   'shipping_address.$.flat_no': params.flat_no,
                   'shipping_address.$.floor_no': params.floor_no,
                   'shipping_address.$.country_code': params.country_code,
                   'shipping_address.$.phone_no': params.phone_no,
                   'shipping_address.$.is_default': params.is_default,
                   'shipping_address.$.notes': params.notes
                }
            }, {new : true} );

            console.log('Updated MEssage',user)
            if(!user) {
               return res.status(200).json(Service.response(0, localization.ServerError, null));
            }
            res.status(200).json(Service.response(1, localization.updateShippingAddress, null));

        } catch (err) {
            res.status(200).json(Service.response(0, localization.ServerError, err.message));
        }
    },

    removeShippingAddress: async (req, res) => {
        try {
            const params = _.pick(req.body, ['id']);

            if(_.isEmpty(params.id)) {
                return res.status(200).json(Service.response(0, localization.missingParamError, null));
            }

            if(!Service.validateObjectId(params.id)) {
                return res.status(200).json(Service.response(0, localization.invalidObjectIdError, null));
            }

            const user = await User.findByIdAndUpdate(req.user.id, { $pull: { shipping_address:{ _id: params.id } } }, { new: true })
            console.log(user)
            if(!user) {
                return res.status(200).json(Service.response(0, localization.ServerError, null));
            }
            res.status(200).json(Service.response(1, localization.removeShippingAddress, null));
        } catch (err) {
            res.status(200).json(Service.response(0, localization.ServerError, err.message));
        }
    },

    listShippingAddress: async (req, res) => {
        try {
            const user = await User.findById(req.user.id, 'shipping_address');

            if(!user) {
                return res.status(200).json(Service.response(0, localization.ServerError, null));
            }

            console.log(user);

            const list = await Promise.all(user.shipping_address.map(l => {
                return {
                    'id': l._id,
                    'full_name': l.full_name,
                    'country': l.country,
                    'area': l.area,
                    'block':l.block ,
                    'street': l.street,
                    'avenue': l.avenue,
                    'building_no': l.building_no,
                    'flat_no': l.flat_no,
                    'floor_no': l.floor_no,
                    'country_code': l.country_code,
                    'phone_no':l.phone_no,
                    'notes': l.notes
                }
            }));
            res.status(200).json(Service.response(1, localization.Success, list));

        } catch (err) {
            res.status(200).json(Service.response(0, localization.ServerError, err.message));
        }
    },

    // Admin Begins Here
    updateUserState: async (req, res) => {
        try {
            const params = _.pick(req.body, ['id', 'state']);
            if(_.isEmpty(params.id) || _.isEmpty(params.state)) {
                return res.status(200).json(Service.response(0, localization.missingParamError, null));
            }
    
            if(!Service.validateObjectId(params.id)) {
                return res.status(200).json(Service.response(0, localization.invalidObjectIdError, null));
            }
    
            if(params.state != 'true' && params.state != 'false') {
                return res.status(200).json(Service.response(0, localization.missingParamError, null));
            }
    
            const user = await User.findByIdAndUpdate(params.id, {
                $set: {
                    'active': params.state
                }
            });
    
            if(!user) {
                return res.status(200).json(Service.response(0, localization.ServerError, null));
            }
            let message;
            if(params.state == 'true') {
                message = localization.userActivate;
            }
            if(params.state == 'false') {
                message = localization.userDeActivate;
            }
            res.status(200).json(Service.response(1, message, null));

        } catch (err) {
             res.status(200).json(Service.response(0, localization.ServerError, err.message));
        }
    }
}