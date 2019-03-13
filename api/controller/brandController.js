const _ = require('lodash');

const localization = require('../service/localization');
const Service = require('../service');
const config = require('../../config');
const Brand = require('../models/brand');
const Celebrity = require('../models/celebrity');
const Product = require('../models/product');
const User = require('../models/user');

module.exports = {

    //Admin Routes From Here
    getListOfBrands: async () => {
        
        const list = await Brand.find({});

        if(!list) {
            return null;
        }
        console.log('List of Brands',list)
        let brand = await Promise.all(list.map(async (b) => {
                return {
                    'id': b._id,
                    'name': b.name,
                    'banner': b.banner,
                    'image': b.image,
                    'created_at': await Service.readableDate(b.created_at)
                }
            })); 
        return brand;
    },

    getBrand: async (id) => {
        if(!Service.validateObjectId(id)) {
            return null;
        }
        const brand = await Brand.findById(id);

        if(!brand) {
            return null;
        }

        return { 
            'id': brand._id,
            'name': brand.name,
            'banner': brand.banner,
            'image': brand.image,
            'created_at': brand.created_at
        }
    },

    addBrand: async (req, res) => {
        try {
            const params = _.pick(req.body, ['name']);
            if(_.isEmpty(params.name)) {
                return res.status(200).json(Service.response(0, localization.missingParamError, null));
            }
            if (!req.files.banner) {
                return res.status(200).json(Service.response(0, localization.missingParamError, null));
            }

            if (!req.files.image) {
                return res.status(200).json(Service.response(0, localization.missingParamError, null));
            }
            const banner = await Service.uploadFile(req.files.banner, config.mime_type, config.imageFile);
            const image = await Service.uploadFile(req.files.image, config.mime_type, config.imageFile);

            const brand = new Brand({
                'name': params.name,
                'banner': config.live_url + banner,
                'image': config.live_url + image
            });

            const rez = await brand.save();

            if(!rez) {
                res.status(200).json(Service.response(0, localization.ServerError, null));    
            }

            res.status(200).json(Service.response(1, localization.Success, rez));

        } catch (err) {
            res.status(200).json(Service.response(0, localization.ServerError, err.message));
        }
    },

    updateBrand: async (req, res) => {
        try {
            const params = _.pick(req.body, ['id', 'name']);

            if(_.isEmpty(params.id) || _.isEmpty(params.name)) {
                return res.status(200).json(Service.response(0, localization.missingParamError, null));
            }
            if(!Service.validateObjectId(params.id)) {
                return res.status(200).json(Service.response(0, localization.invalidObjectIdError, null));
            }
            if(req.files) {
                if(req.files.banner != null) {
                    params.banner = config.live_url +  await Service.uploadFile(req.files.banner, config.mime_type, config.imageFile);
                }
    
                if(req.files.image != null) {
                    params.image = config.live_url +  await Service.uploadFile(req.files.image, config.mime_type, config.imageFile);
                }
            }

            const rez = await Brand.findByIdAndUpdate(params.id, {
                $set: params
            });

            if(!rez) {
                return res.status(200).json(Service.response(0, localization.ServerError, null));    
            }
            res.status(200).json(Service.response(1, localization.updateBrand, null));
        } catch (err) {
            res.status(200).json(Service.response(0, localization.ServerError, err.message));
        }
    },

    deleteBrand: async (req, res) => {
        try {
            const params = _.pick(req.body, ['id']);
            if(_.isEmpty(params.id)) {
                return res.status(200).json(Service.response(0, localization.missingParamError, null));
            }
            if(!Service.validateObjectId(params.id)) {
                return res.status(200).json(Service.response(0, localization.invalidObjectIdError, null));
            }

            const rez = await Brand.findByIdAndDelete(params.id);

            if(!rez) {
                return res.status(200).json(Service.response(0, localization.ServerError, null));
            }

            res.status(200).json(Service.response(1, localization.deleteBrand, null));

        } catch (err) {
            res.status(200).json(Service.response(0, localization.ServerError, err.message));
        }
    },

    //App routes Here
    appBrandList: async (req, res) => {
        try {
            const brands = await Brand.find({}, 'name image').sort({'created_at': -1});
            if(!brands) {
                return res.status(200).json(Service.response(0, localization.ServerError, null));
            }
            list = await Promise.all(brands.map(async (b) => {
                console.log("Brands Details", b)
                return {
                    'id': b._id,
                    'image': b.image,
                    'name': b.name
                }
            }));
            res.status(200).json(Service.response(1, localization.Success, list));  
        } catch (err) {
            res.status(200).json(Service.response(0, localization.ServerError, err.message));
        }
    },

    appBrandDetails: async (req, res) => {
        try {
            const params = _.pick(req.body, ['id']);
            
            if(_.isEmpty(params.id)) {
                return res.status(200).json(Service.response(0, localization.missingParamError, null));
            }

            if(!Service.valiDateObject(params.id)) {
                return res.status(200).json(Service.response(0, localization.invalidObjectIdError, null));
            }

            const brand = await Brand.findById(params.id);

            if(!brand) {
                return res.status(200).json(Service.response(0, localization.ServerError, null));
            }

            const celeb = await Celebrity.find({'brands': brand._id}, 'name photo').sort({ 'name': 1 });

            if(!celeb) {
                return res.status(200).json(Service.response(0, localization.noCelebsForBrand, null));
            }

            const list = await Promise.all(celeb.map(async l => {
                return {
                    'id': l._id,
                    'name': l.name,
                    'image': l.photo
                }
            }));

            const finalObj = {
                'name': brand.name,
                'banner': brand.banner,
                'celebs': list
            }

            res.status(200).json(Service.response(1, localization.Success, finalObj));

        } catch (err) {
            res.status(200).json(Service.response(0, localization.ServerError, err.message));
        }
    },

    appCelebDetailsForBrand: async (req, res) => {
        try {

            const params = _.pick(req.body, ['brand_id', 'celeb_id']);

            if(_.isEmpty(params.brand_id) || _.isEmpty(params.celeb_id) ) {
                return res.status(200).json(Service.response(0, localization.missingParamError, null));
            }

            if(!Service.validateObjectId(params.brand_id) || !Service.validateObjectId(params.celeb_id)){
                return res.status(200).json(Service.response(0, localization.invalidObjectIdError, null));
            }

            const brand = await Brand.findById(params.brand_id);

            if(!brand) {
                return res.status(200).json(Service.response(0, localization.ServerError, null));
            }

            const celeb = await Celebrity.findById(params.celeb_id);

            if(!celeb) {
                return res.status(200).json(Service.response(0, localization.ServerError, null));
            }

            const products = [];
            
            for (const b of celeb.products) {
                const pds = await Product.findById(b);
                if(params.brand_id == pds.brand) {
                    console.log(params.brand_id, pds.brand, pds._id);
                    products.push({
                        'id': pds._id,
                        'image': pds.image,
                        'price': pds.price,
                        'name': pds.name,
                        'is_fav': false
                    });
                }
            }
            // const products = await Product.find({ '_id': {$in: celeb.products} }, 'price name').sort({'created_at': -1});
            const user = await User.findById(req.user.id, 'favorite');

            for (const fav of user.favorite) {
                products.find(element => {
                    if(element.id == fav.toString()) {
                        return element.is_fav = true;
                    }
                });
            }

            const finalObj = {
                'name': celeb.name,
                'image': celeb.photo,
                'banner': brand.banner,
                'products': products
            }
            res.status(200).json(Service.response(1, localization.Success, finalObj));
        } catch (err) {
            res.status(200).json(Service.response(0, localization.ServerError, err.message));
        }
    }

}