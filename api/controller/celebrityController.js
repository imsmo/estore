const _ = require('lodash');
const moment = require('moment');

const localization = require('../service/localization');
const Service = require('../service');
const config = require('../../config');
const Celebrity = require('../models/celebrity');
const Product = require('../models/product');
const Brand = require('../models/brand');
const Review = require('../models/reviews');
const User = require('../models/user');

module.exports = {

    getListOfCelebrity: async () => {
        
        const list = await Celebrity.find({});

        if(!list) {
            return null;
        }
        console.log('List of Celebrity',list)
        let celebrity = await Promise.all(list.map(async (b) => {
                return {
                    'id': b._id,
                    'name': b.name,
                    'created_at': await Service.readableDate(b.created_at)
                }
            })); 
        return celebrity;
    },

    getCelebrity: async (id) => {
        if(!Service.validateObjectId(id)) {
            return null;
        }
        const celebrity = await Celebrity.findById(id);

        if(!celebrity) {
            return null;
        }

        return { 
            'id': celebrity._id,
            'name': celebrity.name,
            'created_at': celebrity.created_at
        }
    },

    addCelebrity: async (req, res) => {
        try {
            const params = _.pick(req.body, ['name','brands','products']);
            if(_.isEmpty(params.name)) {
                return res.status(200).json(Service.response(0, localization.missingParamError, null));
            }
            if(_.isEmpty(params.brands)) {
                return res.status(200).json(Service.response(0, localization.missingParamError, null));
            }
            if(_.isEmpty(params.products)) {
                return res.status(200).json(Service.response(0, localization.missingParamError, null));
            }
            
            if (!req.files) {
                return res.status(200).json(Service.response(0, localization.missingParamError, null));
            }
            
            const bads = params.brands.split(',');
            const pds = params.products.split(',');

            for(b of bads) {
                if(!Service.validateObjectId(b)) {
                    return res.status(200).json(Service.response(0, localization.invalidObjectIdError, null));
                    break;
                }
                const exist = await Service.validateBrand(b);
                if(!exist) {
                    return res.status(200).json(Service.response(0, localization.inValidBrand, null));
                    break;
                }
                console.log('Brand Found');
            }

            for(p of pds) {
                if(!Service.validateObjectId(p)) {
                    return res.status(200).json(Service.response(0, localization.invalidObjectIdError, null));
                    break;
                }
                const exist = await Service.validateProduct(p);
                if(!exist) {
                    return res.status(200).json(Service.response(0, localization.inValidProduct, null));
                    break;
                }
            }

            params.brands = params.brands.split(',');
            params.products = params.products.split(',');
            const photo = config.live_url +  await Service.uploadFile(req.files.photo, config.mime_type, config.imageFile);

            const celebrity = new Celebrity({
                'name': params.name,
                'brands':params.brands,
                'products':params.products,
                'photo':photo
            });

            const rez = await celebrity.save();

            if(!rez) {
                res.status(200).json(Service.response(0, localization.ServerError, null));    
            }
            res.status(200).json(Service.response(1, localization.Success,rez));

        } catch (err) {
            res.status(200).json(Service.response(0, localization.ServerError, err.message));
        }
    },

    updateCelebrity: async (req, res) => {
        try {
            const params = _.pick(req.body, ['id', 'name','brand','products','photo']);

            if(_.isEmpty(params.id) || _.isEmpty(params.name) || _.isEmpty(params.brand) || _.isEmpty(params.products)) {
                return res.status(200).json(Service.response(0, localization.missingParamError, null));
            }
            if(!Service.validateObjectId(params.id)) {
                return res.status(200).json(Service.response(0, localization.invalidObjectIdError, null));
            }
            if(req.files) {
                if(req.files.photo != null) {
                    params.photo = config.live_url +  await Service.uploadFile(req.files.photo, config.mime_type, config.imageFile);
                }
            }
            const rez = await Celebrity.findByIdAndUpdate(params.id, {
                $set: params
            });

            if(!rez) {
                return res.status(200).json(Service.response(0, localization.ServerError, null));    
            }
            res.status(200).json(Service.response(1, localization.updateCelebrity, null));
        } catch (err) {
            res.status(200).json(Service.response(0, localization.ServerError, err.message));
        }
    },

    deleteCelebrity: async (req, res) => {
        try {
            const params = _.pick(req.body, ['id']);
            if(_.isEmpty(params.id)) {
                return res.status(200).json(Service.response(0, localization.missingParamError, null));
            }
            if(!Service.validateObjectId(params.id)) {
                return res.status(200).json(Service.response(0, localization.invalidObjectIdError, null));
            }

            const rez = await Celebrity.findByIdAndDelete(params.id);

            if(!rez) {
                return res.status(200).json(Service.response(0, localization.ServerError, null));
            }

            res.status(200).json(Service.response(1, localization.deleteCelebrity, null));

        } catch (err) {
            res.status(200).json(Service.response(0, localization.ServerError, err.message));
        }
    },

    //App Routes Here
     appListofCelebrity: async (req, res) => {
         try {
            const celebs = await Celebrity.find({}, 'photo name').sort({ 'name': 1, 'created_at': -1 });
            if(!celebs) {
                return res.status(200).json(Service.response(0, localization.ServerError, null));
            }
            const list = await Promise.all(celebs.map(async c => {
                return {
                    'id': c._id,
                    'name': c.name,
                    'image': c.photo
                }
            }));
            res.status(200).json(Service.response(1, localization.Success, list));
         } catch (err) {
            res.status(200).json(Service.response(0, localization.ServerError, err.message));
         }
     },

     appCelebDetails: async (req, res) => {
         try {
            const params = _.pick(req.body, ['id']);

            if(_.isEmpty(params.id)) {
                return res.status(200).json(Service.response(0, localization.missingParamError, null));
            }
            if(!Service.validateObjectId(params.id)) {
                return res.status(200).json(Service.response(0, localization.invalidObjectIdError, null));
            }
    
            const celeb = await Celebrity.findById(params.id);
    
            const products = await Product.find({ '_id': { $in: celeb.products } }).sort({'created_at': -1});
            const brands = await Brand.find({ '_id': { $in: celeb.brands }}).sort({ 'created_at': -1 });
            const user = await User.findById(req.user.id, 'favorite');
    
            const pl = await Promise.all(products.map(p => {
                return {
                    'id': p._id,
                    'name': p.name,
                    'image': p.image,
                    'price': p.price,
                    'is_fav': false
                }
            }));

            const bl = await Promise.all(brands.map(b => {
                return {
                    'id': b._id,
                    'name': b.name,
                    'image': b.image,
                    'banner': b.banner
                }
            }));

            for (const fav of user.favorite) {
                pl.find(element => {
                    if(element.id == fav.toString()) {
                        return element.is_fav = true;
                    }
                });
            }

            const finalObj = { 
                'id': celeb._id,
                'name': celeb.name,
                'photo': celeb.photo,
                'products': pl,
                'brands': bl 
            }
            res.status(200).json(Service.response(1, localization.Success, finalObj));     
         } catch (err) {
            res.status(200).json(Service.response(0, localization.ServerError, err.message));
         }
     },
     celebReviewsList: async (req, res) => {
        try {
            const params = _.pick(req.body, ['id']);
            if(_.isEmpty(params.id)) {
                return res.status(200).json(Service.response(0, localization.missingParamError, null));
            }
            if(!Service.validateObjectId(params.id)) {
                return res.status(200).json(Service.response(0, localization.invalidObjectIdError, null));
            }

            const revs = await Review.find({ 'celebrity': params.id }).populate('brand product celebrity');

            const celeb = await Celebrity.findById(params.id, 'name photo');

            const list = await Promise.all(revs.map(async r => {
                return {
                    'id': r._id,
                    'review': r.review,
                    'video_cover': r.video_cover,
                    'views': _.toString(r.views_count),
                    'name': r.celebrity.name,
                    'created_at': moment(r.created_at).fromNow() 
                }
            }))

            finalObj = {
                'id': celeb._id,
                'name': celeb.name,
                'image': celeb.photo,
                'reviews': list
            }
            res.status(200).json(Service.response(1, localization.Success, finalObj));

        } catch (err) {
            res.status(200).json(Service.response(0, localization.ServerError, err.message));
        }
     },

     celebReviewDetails: async (req, res) => {
        try {
            const params = _.pick(req.body, ['id']);

            console.log('Celeb Review Details Here :: ', params);
            
            if(_.isEmpty(params.id)) {
                return res.status(200).json(Service.response(0, localization.missingParamError, null));
            }
            if(!Service.validateObjectId(params.id)) {
                return res.status(200).json(Service.response(0, localization.invalidObjectIdError, null));
            }

            const review = await Review.findById(params.id).populate('celebrity product');

            if(!review) {
                return res.status(200).json(Service.response(0, localization.ServerError, null));    
            }

            const products = await Product.find({ '_id': { $in: review.celebrity.products }}, 'image name price');

            const list = await Promise.all(products.map(p => {
                return {
                    'id': p._id,
                    'image': p.image,
                    'price': p.price,
                    'name': p.name,
                    'is_fav': false
                }
            }));

            const user = await User.findById(req.user.id, 'favorite');

            for (const fav of user.favorite) {
                list.find(element => {
                    if(element.id == fav.toString()) {
                        return element.is_fav = true;
                    }
                });
            }
            const finalObj = {
                'id': review._id,
                'video': review.video,
                'views': review.views_count,
                'name': review.celebrity.name,
                'review': review.review,
                'product_name': review.product.name,
                'products': list,
                'created_at': moment(review.created_at).fromNow()
            }
            res.status(200).json(Service.response(1, localization.Success, finalObj));

        } catch (err) {
            res.status(200).json(Service.response(0, localization.ServerError, err.message));
        }
     }

}