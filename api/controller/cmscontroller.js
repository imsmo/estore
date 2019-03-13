const _ = require('lodash');

const localization = require('../service/localization');
const Service = require('../service');
const config = require('../../config');

const Contact = require('../models/contact');
const Faq = require('../models/Faq');

module.exports = {
    
    //Admin Starts Here

    //Manage Contact US

    addContactUsInfo: async (req, res) => {
        try {
            const params = _.pick(req.body, ['email', 'phone_no', 'facebook', 'twitter', 'instagram', 'youtube', 'google_plus']);
            
            if(_.isEmpty(params.email) ||
                _.isEmpty(params.phone_no) ||
                _.isEmpty(params.facebook) ||
                _.isEmpty(params.twitter) ||
                _.isEmpty(params.instagram) ||
                _.isEmpty(params.youtube) ||
                _.isEmpty(params.google_plus)) {
                return res.status(200).json(Service.response(0, localization.missingParamError, null));
            }
            if(!Service.validateEmail(params.email)) {
                return res.status(200).json(Service.response(0, localization.emailValidationError, null));
            }

            if(!Service.validateURL(params.facebook) || 
                !Service.validateURL(params.youtube) ||
                !Service.validateURL(params.instagram) ||
                !Service.validateURL(params.google_plus) ||
                !Service.validateURL(params.twitter)) {
                return res.status(200).json(Service.response(0, localization.invalidURL, null));
            }

            const contact = await new Contact({
                'email': params.email,
                'phone_no': params.phone_no,
                'follow_us' : {
                    'facebook': params.facebook,
                    'instagram': params.instagram,
                    'youtube': params.youtube,
                    'twitter': params.twitter,
                    'google_plus': params.google_plus
                }
            }).save();

            if(!contact) {
                return res.status(200).json(Service.response(0, localization.ServerError, null));
            }
            res.status(200).json(Service.response(1, localization.Success, null));

        } catch (err) {
            res.status(200).json(Service.response(0, localization.ServerError, err.message));
        }
    },

    updateContactUsInfo: async (req, res) => {
        try {
            const params = _.pick(req.body, ['id','email', 'phone_no', 'facebook', 'twitter', 'instagram', 'youtube', 'google_plus']);
            
            if(_.isEmpty(params.email) ||
                _.isEmpty(params.phone_no) ||
                _.isEmpty(params.facebook) ||
                _.isEmpty(params.twitter) ||
                _.isEmpty(params.instagram) ||
                _.isEmpty(params.youtube) ||
                _.isEmpty(params.id) ||
                _.isEmpty(params.google_plus)) {
                return res.status(200).json(Service.response(0, localization.missingParamError, null));
            }
            if(!Service.validateEmail(params.email)) {
                return res.status(200).json(Service.response(0, localization.emailValidationError, null));
            }

            if(!Service.validateObjectId(params.id)) {
                return res.status(200).json(Service.response(0, localization.invalidObjectIdError, null));
            }

            if(!Service.validateURL(params.facebook) || 
                !Service.validateURL(params.youtube) ||
                !Service.validateURL(params.instagram) ||
                !Service.validateURL(params.google_plus) ||
                !Service.validateURL(params.twitter)) {
                return res.status(200).json(Service.response(0, localization.invalidURL, null));
            }

            const contact = await Contact.findByIdAndUpdate(params.id, params);

            if(!contact) {
                return res.status(200).json(Service.response(0, localization.ServerError, null));
            }
            res.status(200).json(Service.response(1, localization.Success, null));

        } catch (err) {
            res.status(200).json(Service.response(0, localization.ServerError, err.message));
        }
    },

    //App Here
    contactUs: async (req, res) => {
        try {
            const info = await Contact.findOne({});

            console.log(info)

            finalObj = {
                'id': info._id,
                'email': info.email,
                'phone_no': info.phone_no,
                'instagram': info.follow_us.instagram,
                'facebook': info.follow_us.facebook,
                'youtube': info.follow_us.youtube,
                'google_plus': info.follow_us.google_plus,
                'twitter': info.follow_us.twitter
            }
            res.status(200).json(Service.response(1, localization.Success, finalObj));
        } catch (err) {
            res.status(200).json(Service.response(0, localization.ServerError, err.message));
        }
    },

    getInTouch: async (req, res) => {
        try {
            const params = _.pick(req.body, ['id', 'name', 'email', 'phone', 'comments']);

        if(_.isEmpty(params.id) || 
            _.isEmpty(params.email) || 
            _.isEmpty(params.comments) || 
            _.isEmpty(params.phone) ||
            _.isEmpty(params.name)) {
            return res.status(200).json(Service.response(0, localization.missingParamError, null));
        }
        if(!Service.validateEmail(params.email)) {
            return res.status(200).json(Service.response(0, localization.emailValidationError, null));
        }

        if(!Service.validateObjectId(params.id)) {
            return res.status(200).json(Service.response(0, localization.invalidObjectIdError, null));
        }

        if(_.isNaN(params.phone)) {
            return res.status(200).json(Service.response(0, localization.mobileValidationError, null));
        }

        if(params.phone.length != 10) {
            return res.status(200).json(Service.response(0, localization.mobileValidationError, null));
        }

        const contact = await Contact.findByIdAndUpdate(params.id, { $push: { queries: params } });

        if(!contact) {
            return res.status(200).json(Service.response(0, localization.ServerError, null));
        }
        res.status(200).json(Service.response(1, localization.Success, null));
        } catch (err) {
            res.status(200).json(Service.response(0, localization.ServerError, err.message));
        }
    },

    aboutUs: async (req, res) => {
        try {
            
        } catch (err) {
            res.status(200).json(Service.response(0, localization.ServerError, err.message));
        }
    },

    //Admin FAQS

    Faq: async (req, res) => {
        try {
            const params = _.pick(req.body, ['question', 'answer']);

            if(_.isEmpty(params.question) || _.isEmpty(params.answer)) {
                return res.status(200).json(Service.response(0, localization.missingParamError, null));
            }

            const faq = await new Faq(params).save();
            
            if(!faq) {
                return res.status(200).json(Service.response(0, localization.ServerError, null));
            }
            res.status(200).json(Service.response(1, localization.Success, null));
        } catch (err) {
            res.status(200).json(Service.response(0, localization.ServerError, err.message));
        }
    },

    updateFaq: async (req, res) => {
        try {
            const params = _.pick(req.body, ['id', 'question', 'answer']);

            if(_.isEmpty(params.id) || _.isEmpty(params.question) || _.isEmpty(params.answer)) {
                return res.status(200).json(Service.response(0, localization.missingParamError, null));
            }

            if(!Service.validateObjectId(params.id)) {
                return res.status(200).json(Service.response(0, localization.invalidObjectIdError, null));
            }

            const faq = await Faq.findByIdAndUpdate(params.id, params);

            if(!faq) {
                return res.status(200).json(Service.response(0, localization.ServerError, null));
            }
            res.status(200).json(Service.response(1, localization.Success, null));
        } catch (err) {
            res.status(200).json(Service.response(0, localization.ServerError, err.message));
        }
    },

    //App Faqs

    appFaq: async (req, res) => {
        try {
            const faq = await Faq.find({});

            if(!faq) {
                return res.status(200).json(Service.response(0, localization.ServerError, null));
            }
            const list = await Promise.all(faq.map(f => {
                return {
                    'id': f._id,
                    'question': f.question,
                    'answer': f.answer
                }
            }));
            res.status(200).json(Service.response(1, localization.Success, list));

        } catch (err) {
            res.status(200).json(Service.response(0, localization.ServerError, err.message));
        }
    },

    // appAbout: async (req, res) => {
    //     try {
            
    //     } catch (err) {
    //         res.status(200).json(Service.response(0, localization.ServerError, err.message));
    //     }
    // }

}