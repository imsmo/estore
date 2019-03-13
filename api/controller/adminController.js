const _ = require('lodash');
var Admin = require('../models/admin');
const localization = require('../service/localization');
const Service = require('../service');
const config = require('./../../config');

var bcrypt = require('bcryptjs');

 
module.exports = {
   
    login: async function (req, res) {
        var params = _.pick(req.body, 'email', 'password');
    
        console.log('ADMIN LOGIN REQUEST >> ', params);
    
        if (_.isEmpty(params)) {
          return res
            .status(200)
            .json(Service.response(0, localization.missingParamErrorAdmin, null));
        }
    
        if (_.isEmpty(params.email) || _.isEmpty(params.password)) {
          return res
            .status(200)
            .json(Service.response(0, localization.missingParamErrorAdmin, null));
        }
    
        var user = await Admin.findOne({
          email: params.email,
        });
    
        if (!user)
          return res
            .status(200)
            .json(Service.response(0, localization.invalidCredentials, null));
    
        var rez1 = await bcrypt.compare(params.password, user.password);
    
        if (!rez1)
          return res
            .status(200)
            .json(Service.response(0, localization.invalidCredentials, null));
    
        var token = await Service.issueToken(params);
    
        //TOKEN GENERATE FOR SINGLE LOGIN AT A TIME
        // user.tokens = [{
        // 	'access': 'auth',
        // 	'token': token
        // }];
    
        req.session.auth = token;
        req.session.auth.maxAge = 36000000;
    
        console.log('SESSION UPDATED', req.session);
        // IN CASE IF MULTIPLE LOGINS ALLOWED
    
        var rez = await user.save();
    
        if (!rez)
          return res
            .status(200)
            .json(Service.response(0, localization.ServerError, null));
    
        return res
          .status(200)
          .json(Service.response(1, localization.loginSuccess, token));
      },

      
    register: async (req, res) => {
        try {
            const params = _.pick(req.body, ['full_name', 'email', 'password']);
            console.log('Register Request :: ', params);
            if(_.isEmpty(params.full_name) ||
                _.isEmpty(params.email) ||
                _.isEmpty(params.password)) {
                return res.status(422).json(Service.response(0, localization.missingParamError, null));
            }
            if(!Service.validateEmail(params.email)) {
                return res.status(422).json(Service.response(0, localization.emailValidationError, null));
            }
            if(params.password.trim().length < 6 || params.password.trim().length > 20) {
                return res.status(422).json(Service.response(0, localization.passwordValidationError, null));
            }
        
            const us = await Admin.findOne({
                'email': params.email.trim()
            });
            if(us) {
                return res.status(400).json(Service.response(0, localization.emailExistError, null));
            }

            const hash = bcrypt.hashSync(params.password);

            const token = await Service.issueToken(params);
        
            const admin = new Admin({
                'full_name': params.full_name,
                'email': params.email,
                'password': hash,
            });

            const rez = await admin.save();

            if(!rez) {
                res.status(500).json(Service.response(0, localization.ServerError, null));    
            }

            resObj = {
                'id': rez._id,
                'full_name': rez.full_name,
                'email': rez.email,
                'password':rez.password,
            }

            res.status(422).json(Service.response(1, localization.Success, resObj));
        } catch (err) {
            res.status(500).json(Service.response(0, localization.ServerError, err.message));
        }

    },

}