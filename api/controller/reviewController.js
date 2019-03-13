const Review = require('../models/reviews');
const Service = require('../service');
const localization = require('../service/localization');
const config = require('../../config');
const moment = require('moment');

const _ = require('lodash');

module.exports = {

    //Admin Starts Here
    addReview: async (req, res) => {
        try {
            const params = _.pick(req.body,['celebrity', 'brand', 'product', 'review', 'rating', 'video_cover', 'video']);
            if(_.isElement(params.celebrity) ||
                _.isEmpty(params.brand) ||
                _.isEmpty(params.product) || 
                _.isEmpty(params.review) ||
                _.isEmpty(params.rating)) {
                return res.status(200).json(Service.response(0, localization.missingParamError, null));
            }

            if(!Service.validateObjectId(params.celebrity) || 
                !Service.validateObjectId(params.brand) || 
                !Service.validateObjectId(params.product)) {
                return res.status(200).json(Service.response(0, localization.invalidObjectIdError, null));
            }

            if(!Service.validateBrand(params.brand)) {
                return res.status(200).json(Service.response(0, localization.inValidBrand, null));
            }

            if(!Service.validateBrand(params.product)) {
                return res.status(200).json(Service.response(0, localization.inValidProduct, null));
            }

            if(_.isNaN(params.rating)) {
                return res.status(200).json(Service.response(0, localization.inValidRating, null));
            }

            if(params.rating < 0 || params.rating > 5) {
                return res.status(200).json(Service.response(0, localization.inValidRating, null));
            }

            if(!req.files) {
                return res.status(200).json(Service.response(0, localization.missingParamError, null));
            }

            if(!req.files.video_cover || !req.files.video) {
                return res.status(200).json(Service.response(0, localization.missingParamError, null));
            }

            if(!Service.validFileSize(req.files.video, config.videoFile)) {
                return res.status(200).json(Service.response(0, localization.invalidVideoFile, null));
            }

            if(!Service.validFileSize(req.files.video_cover, config.imageFile)) {
                return res.status(200).json(Service.response(0, localization.invalidImageFile, null));
            }
        
            params.video = config.live_url +  await Service.uploadFile(req.files.video, config.mime_type, config.videoFile);

            params.video_cover = config.live_url + await Service.uploadFile(req.files.video_cover, config.mime_type, config.imageFile);

            const review = await new Review(params).save();

            if(!review) {
                return res.status(200).json(Service.response(0, localization.ServerError, null));    
            }

            res.status(200).json(Service.response(1, localization.reviewAdded, review));

        } catch (err) {
            res.status(200).json(Service.response(0, localization.ServerError, err.message));
        }
    },

    //App Starts Here

    increaseReviewCount: async (req, res) => {
        try {
            const params = _.pick(req.body, ['id']);

            if(_.isEmpty(params.id)) {
                return res.status(200).json(Service.response(0, localization.missingParamError, null));
            }

            if(!Service.validateObjectId(params.id)) {
                return res.status(200).json(Service.response(0, localization.invalidObjectIdError, null));
            }

            const review = await Review.findById(params.id);

            if(!review) {
                return res.status(200).json(Service.response(0, localization.ServerError, null));
            }
            review.views_count++;

            const rez = await review.save();

            if(!rez) {
                return res.status(200).json(Service.response(0, localization.ServerError, null));
            }
            res.status(200).json(Service.response(1, localization.Success, rez));
        } catch (err) {
            res.status(200).json(Service.response(0, localization.ServerError, err.message));
        }
    },

    appListReviews: async (req, res) => {
        try {
            const reviews = await Review.find({}).populate('brand product celebrity').limit(8);
            
            if(!reviews) {
                return res.status(200).json(Service.response(0, localization.ServerError, null));
            }

            const list = await Promise.all(reviews.map(r => {
                    return {
                        'id': r._id,
                        'video_cover': r.video_cover,
                        'views': r.views_count,
                        'review': r.review,
                        'name': r.celebrity.name,
                        'product_name': r.product.name,
                        'created_at': moment(r.created_at).fromNow()
                    }

            }));
            res.status(200).json(Service.response(1, localization.Success, list));
        } catch (err) {
            res.status(200).json(Service.response(0, localization.ServerError, err.message));
        }
    }

}