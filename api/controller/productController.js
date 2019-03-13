const _ = require('lodash');

const Service = require('../service');
const localization = require('../service/localization');
const config = require('../../config');
const Product = require('../models/product');
const Brand = require('../models/brand');

module.exports = {

    //Admin Routes Start Here
    getProductList: async () => {
        try {
            const pds = await Product.find({}).populate('brand', 'name');
            if(!pds) {
                return null;
            }
            console.log('List of Products',pds);

            let brand = await Promise.all(pds.map(async (b) => {
                    return {
                        'id': b._id,
                        'name': b.name,
                        'brand': b.brand.name,
                        'price': b.price,
                        'image': b.image,
                        'created_at': await Service.readableDate(b.created_at)
                    }
                })); 
            return brand;
        } catch (error) {
            res.status(200).json(Service.response(0, localization.ServerError, err.message));
        }
    },

    getProduct: async (id) => {
        try {
            if(!Service.validateObjectId(id)) {
                return null;
            }

            const product = await Product.findById(id).populate('brand', 'name');

            if(!product) {
                return null
            }

            return {
                'id': product._id,
                'name': product.name,
                'brand': product.brand.name,
                'height': product.height,
                'width': product.width,
                'length': product.length,
                'no_products': product.no_products,
                'description': product.description,
                'specification': product.specification,
                'e_credit': product.e_credit,
                'price': product.price,
                'weight': product.weight,
                'image': product.image
            }

        } catch (error) {
            res.status(200).json(Service.response(0, localization.ServerError, err.message));
        }
    },
    
    addProduct: async (req, res) => {
        try {
            const params = _.pick(req.body, ['name', 'brand', 'price', 'e_credit', 'description', 'specification', 'height', 'width', 'length', 'weight', 'no_products']);
            if(_.isEmpty(params.name) ||
               _.isEmpty(params.brand) ||
               _.isEmpty(params.price) || 
               _.isEmpty(params.e_credit) || 
               _.isEmpty(params.description) ||
               _.isEmpty(params.specification) || 
               _.isElement(params.height) || 
               _.isEmpty(params.weight) || 
               _.isEmpty(params.width) || 
               _.isEmpty(params.no_products) ||
               _.isEmpty(params.length)) {
                return res.status(200).json(Service.response(0, localization.missingParamError, null));
               }
            
            if(!Service.validateObjectId(params.brand)) {
                return res.status(200).json(Service.response(0, localization.invalidObjectIdError, null));
            }

            if(_.isNaN(params.e_credit) || 
                _.isNaN(params.price) || 
                _.isNaN(params.height) || 
                _.isNaN(params.weight || 
                _.isNaN(params.width) ||
                _.isNaN(params.no_products) ||
                _.isNaN(params.length))) {
                return res.status(200).json(Service.response(0, localization.missingParamError, null));
            }
            const validBrand = await Service.validateBrand(params.brand);

            if(!validBrand) {
                return res.status(200).json(Service.response(0, localization.inValidBrand, null));
            }

            if(!req.files) {
                return res.status(200).json(Service.response(0, localization.missingParamError, null));
            }

            params.image = config.live_url +  await Service.uploadFile(req.files.image, config.mime_type, config.imageFile);

            const product = new Product(params);
            const rez = await product.save();

            if(!rez) {
               return res.status(200).json(Service.response(0, localization.ServerError, null));    
            }
            res.status(200).json(Service.response(1, localization.Success, null));
        } catch (err) {
            res.status(200).json(Service.response(0, localization.ServerError, err.message));
        }
    },

    updateProduct: async (req, res) => {
        try {
            const params = _.pick(req.body, ['id','name', 'brand', 'price', 'e_credit', 'description', 'specification', 'height', 'width', 'length', 'weight', 'no_products']);
            if(_.isEmpty(params.id) ||
               _.isEmpty(params.name) ||
               _.isEmpty(params.brand) ||
               _.isEmpty(params.price) || 
               _.isEmpty(params.e_credit) || 
               _.isEmpty(params.description) ||
               _.isEmpty(params.specification) || 
               _.isElement(params.height) || 
               _.isEmpty(params.weight) || 
               _.isEmpty(params.width) || 
               _.isEmpty(params.no_products) ||
               _.isEmpty(params.length)) {
                return res.status(200).json(Service.response(0, localization.missingParamError, null));
               }
            
            if(!Service.validateObjectId(params.brand)) {
                return res.status(200).json(Service.response(0, localization.invalidObjectIdError, null));
            }

            if(!Service.validateObjectId(params.id)) {
                return res.status(200).json(Service.response(0, localization.invalidObjectIdError, null));
            }

            if(_.isNaN(params.e_credit) || 
                _.isNaN(params.price) || 
                _.isNaN(params.height) || 
                _.isNaN(params.weight || 
                _.isNaN(params.width) ||
                _.isNaN(params.no_products) ||
                _.isNaN(params.length))) {
                return res.status(200).json(Service.response(0, localization.missingParamError, null));
            }
            const validBrand = await Service.validateBrand(params.brand);

            if(!validBrand) {
                return res.status(200).json(Service.response(0, localization.inValidBrand, null));
            }

            if(req.files) {
                params.image = await Service.uploadFile(req.files.image, config.mime_type, config.imageFile);
            }

            const rez = await Product.findByIdAndUpdate(params.id, {
                $set: params
            });

            if(!rez) {
               return res.status(200).json(Service.response(0, localization.ServerError, null));    
            }
            res.status(200).json(Service.response(1, localization.Success, null));
        } catch (err) {
            res.status(200).json(Service.response(0, localization.ServerError, err.message));
        }
    },

    deleteProduct: async (req, res) => {
        try {
            const params = _.pick(req.body, ['id']);
            if(_.isEmpty(params.id)) {
                return res.status(200).json(Service.response(0, localization.missingParamError, null));
            }
            if(!Service.validateObjectId(params.id)) {
                return res.status(200).json(Service.response(0, localization.invalidObjectIdError, null));
            }

            const rez = await Product.findByIdAndDelete(params.id);

            if(!rez) {
                return res.status(200).json(Service.response(0, localization.ServerError, null));
            }
            res.status(200).json(Service.response(1, localization.deleteProduct, null));
        } catch (err) {
            res.status(200).json(Service.response(0, localization.ServerError, err.message));
        }
    },

    //App Starts Here
    appListofProduct: async (req, res) => {
        try { 
            const products = await Product.find({}, 'name brand price image').populate('brand', 'name') .sort({'created_at': -1});
            if(!products) {
                return res.status(200).json(Service.response(0, localization.ServerError, null));
            }
            const list = await Promise.all(products.map (async (p) => {
                return {
                    'id': p._id,
                    'name': p.name,
                    'brand': p.brand.name,
                    'price': p.price,
                    'image': p.image
                }
            }));
            res.status(200).json(Service.response(1, localization.Success, list));  
        } catch (err) {
            res.status(200).json(Service.response(0, localization.ServerError, err.message));
        }
    },

    appProductDetails: async (req, res) => {
        try {
            const params = _.pick(req.body, ['id']);
            
            if(_.isEmpty(params.id)) {
                return res.status(200).json(Service.response(0, localization.missingParamError, null));
            }

            if(!Service.valiDateObject(params.id)) {
                return res.status(200).json(Service.response(0, localization.invalidObjectIdError, null));
            }

            const pds = await Product.findById(params.id).populate('brand', 'name');

            const finalObj = {
                'id': pds._id,
                'no_products': pds.no_products,
                'e_credit':pds.e_credit,
                'name': pds.name,
                'brand': pds.brand.name,
                'price': pds.price,
                'description': pds.description,
                'specification': pds.specification,
                'height':pds.height,
                'width':pds.width,
                'length':pds.length,
                'weight':pds.weight,
                'image':pds.image,
                'created_at':await Service.readableDate(pds.created_at) 
            }

            if(!pds) {
                return res.status(200).json(Service.response(0, localization.ServerError, null));
            }
            res.status(200).json(Service.response(1, localization.Success, finalObj));

        } catch (err) {
            res.status(200).json(Service.response(0, localization.ServerError, err.message));
        }
    },

    searchProduct: async (req, res) => {
        try {
            const product = await Product.find({ 'name': { '$regex': req.query.q, '$options': 'i' } });
            list = await Promise.all(product.map(async (l) => {
				return {
					'id': l._id.toString(),
                    'name': _.capitalize(l.name),
                    'image': l.image
				}
            }));
            res.status(200).json(Service.response(1, localization.Success, list));
        } catch (err) {
            res.status(200).json(Service.response(0, localization.ServerError, err.message));
        }
    }
}