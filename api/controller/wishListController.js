const _ = require('lodash');
const moment = require('moment');

const localization = require('../service/localization');
const Service = require('../service');
const config = require('../../config');
const User = require('../models/user');

module.exports =  {

    addToWishList: async (req, res) => {
        try {
            const params = _.pick(req.body, ['id']);

            if(_.isEmpty(params.id)) {
                return res.status(200).json(Service.response(0, localization.missingParamError, null));
            }

            if(!Service.validateObjectId(params.id)) {
                return res.status(200).json(Service.response(0, localization.invalidObjectIdError, null));
            }

            const user = await User.findById(req.user._id, 'wishlist');
            
            let exists = false;

            await user.wishlist.filter((f) => {
                if(f._id == params.id) {
                   return exists = true;
                } 
                return exists = false;
            });

            if(!exists) {
                user.wishlist.push(params.id);
            }

            const rez = await user.save();;

            if(!rez) {
                res.status(200).json(Service.response(0, localization.ServerError, null));    
            }
            res.status(200).json(Service.response(1, localization.addProductToWishList, rez));

        } catch (err) {
            res.status(200).json(Service.response(0, localization.ServerError, err.message));
        }
    },

    removeFromWishList: async (req, res) => {
        try {
            const params = _.pick(req.body, ['id']);

            if(_.isEmpty(params.id)) {
                return res.status(200).json(Service.response(0, localization.missingParamError, null));
            }

            if(!Service.validateObjectId(params.id)) {
                return res.status(200).json(Service.response(0, localization.invalidObjectIdError, null));
            }

            const user = await User.findById(req.user._id, 'wishlist');
            
            let exists = false;

            await user.wishlist.filter((f) => {
                if(f._id == params.id) {
                   return exists = true;
                } 
                return exists = false;
            });

            if(exists) {
                user.wishlist.splice(params.id, 1);
            }

            const rez = await user.save();

            if(!rez) {
                res.status(200).json(Service.response(0, localization.ServerError, null));    
            }
            res.status(200).json(Service.response(1, localization.removeProductFromWishList, rez));

        } catch (err) {
            res.status(200).json(Service.response(0, localization.ServerError, err.message));
        }
    },

    listofWishList: async (req, res) => {
        try {
            const list = await User.findById(req.user._id, 'email full_name').populate('wishlist', 'price name image');
            console.log(list);
            if(!list) {
                return res.status(200).json(Service.response(0, localization.ServerError, null));
            }
            const fl = await Promise.all(list.wishlist.map(async l => {
                return {
                    'id': l._id,
                    'name': _.capitalize(l.name),
                    'price': _.toString(l.price),
                    'image': l.photo
                }
            }));
            const finalobj = {
                'id': list._id,
                'name': _.capitalize(list.full_name),
                'email': list.email,
                'wishlist': fl
            }
            res.status(200).json(Service.response(1, localization.Success, finalobj));
        } catch (err) {
            res.status(200).json(Service.response(0, localization.ServerError, err.message));
        }
    }

}