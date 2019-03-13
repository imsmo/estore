const Service = require('../service');
const localization = require('../service/localization');
module.exports = (err, req, res, next) => {
    res.status(200).json(Service.response(0, localization.ServerError, null));
}