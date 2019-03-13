const _ = require('lodash');
const moment = require('moment');

const localization = require('../service/localization');
const Service = require('../service');
const config = require('../../config');
const User = require('../models/user');
const Product = require('../models/product');

module.exports = {

    addToMyBox: async (req, res) => {
        try {
            const params = _.pick(req.body, ['id']);

            if(_.isEmpty(params.id)) {
                return res.status(200).json(Service.response(0, localization.missingParamError, null));
            }

            if(!Service.validateObjectId(params.id)) {
                return res.status(200).json(Service.response(0, localization.invalidObjectIdError, null));
            }

            const user = await User.findById(req.user._id, 'my_box');
            
            let exists = false;

            await user.my_box.filter((f) => {
                if(f.product == params.id) {
                    return exists = true;
                } 
                return exists = false;
            });

            if(!exists) {
                const pobj = {
                    'product': params.id,
                    'shipping_charges': 10
                }
                user.my_box.push(pobj);
            }

            const rez = await user.save();

            if(!rez) {
                res.status(200).json(Service.response(0, localization.ServerError, null));    
            }
            res.status(200).json(Service.response(1, localization.addProductToWishList, rez));

        } catch (err) {
            res.status(200).json(Service.response(0, localization.ServerError, err.message));
        }
    },

    removeFromMyBox: async (req, res) => {
        try {
            const params = _.pick(req.body, ['id']);

            if(_.isEmpty(params.id)) {
                return res.status(200).json(Service.response(0, localization.missingParamError, null));
            }

            if(!Service.validateObjectId(params.id)) {
                return res.status(200).json(Service.response(0, localization.invalidObjectIdError, null));
            }

            const user = await User.findById(req.user._id, 'my_box');

            console.log('My Bag', user.my_box);
            
            let exists;

            await user.my_box.find((f) => {
                if(params.id == f._id) {
                   return exists = true;
                }
                return exists = false;
            });
            if(exists) {
                user.my_box.splice(params.id, 1);
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

    listofMyBox: async (req, res) => {
        try {
            const list = await User.findById(req.user._id, 'my_box');
            let total_price = 0;
            let shipping_price = 0;
            console.log('List of Box',list.my_box)
            if(!list) {
                return res.status(200).json(Service.response(0, localization.ServerError, null));
            }
            const fl = await Promise.all(list.my_box.map(async l => {
                const product = await Product.findById(l.product, 'name price image');
                total_price = total_price + product.price;
                // shipping_price = shipping_price + l.shipping_charges;
                return {
                    'id': l._id,
                    'name': _.capitalize(product.name),
                    'price': _.toString(product.price),
                    'image': product.image
                }
            }));
            const finalobj = {
                'id': list._id,
                'name': _.capitalize(list.full_name),
                'email': list.email,
                'my_box': fl,
                'total_price': total_price,
                // 'shipping_charges': shipping_price
            }
            res.status(200).json(Service.response(1, localization.Success, finalobj));
        } catch (err) {
            res.status(200).json(Service.response(0, localization.ServerError, err.message));
        }
    }

}