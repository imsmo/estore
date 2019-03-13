const jwt = require('jsonwebtoken');
const _ = require('lodash');

const localization = require('../service/localization');
const Service = require('../service');
const config = require('../../config');
const User = require('../models/user');

module.exports = {
    
    authenticate: async (req, res, next) => {
        try {
            const params = _.pick(req.body, ['token']);
            if(_.isEmpty(params.token)) {
                return res.status(200).json(Service.response(3, localization.rightsFail, null));
            }
            await jwt.verify(params.token, config.apiSecret);
        
            const us = await User.findOne({ 'tokens.token': params.token });
            if(!us) {
                return res.status(200).json(Service.response(3, localization.tokenExpired, null));
            }
            req.user = us;
            next();
        } catch (error) {
            if(error.message == 'jwt expired') {
               return res.status(200).json(Service.response(3, localization.tokenExpired, null));
            }
            if(error.message == 'invalid token') {
                return res.status(200).json(Service.response(3, localization.tokenExpired, null));
            }
            if(error.message == 'invalid signature') {
                return res.status(200).json(Service.response(3, localization.tokenExpired, null));
            }
            res.status(200).json(Service.response(3, localization.ServerError, null));
        }
    },
}