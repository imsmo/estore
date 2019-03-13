const jwt = require('jsonwebtoken');
const ObjectId = require('mongoose').Types.ObjectId;
const mime = require('mime-types');

const config = require('../../config');
const Brand = require('../models/brand');
const Product = require('../models/product');
const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const months = ['Jan','Feb','Mar','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec'];

module.exports = {
    response: (status, message, data) =>  {
        return {
            status: status,
            message: message,
            data: data,
        };
    },

    issueToken: (data) => {
        return jwt.sign(data, config.apiSecret,{expiresIn: '7d' });
    },

    validateBrand: async (id) => {
        const brand = await Brand.findById(id);
        if(!brand) {
            return false;
        }
        return true
    },

    validateProduct: async (id) => {
        const brand = await Product.findById(id);
        if(!brand) {
            return false;
        }
        return true
    },

    validateEmail: (email) => {
        const re = /[^\s@]+@[^\s@]+\.[^\s@]+/;
        return re.test(email);
    },

    validatePassword: (password) => {
        const re = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})");
        return re.test(password)
    },

    validateURL: (url) => {
        const re = new RegExp(
            '(https?://(?:www.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|www.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|https?://(?:www.|(?!www))[a-zA-Z0-9].[^s]{2,}|www.[a-zA-Z0-9].[^s]{2,})',
        );
        return re.test(url);
    },

    valiDate: (date) => {
        const re = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
        return re.test(date);
    },

    valiDateObject: (date) => {
        const da = new Date(date);
        if (da) return true;
        return false;
    },

    generateOtp: async (user) => {
        return {
            status: true,
            // otp: await this.randomNumber(config.otp_length),
            otp: 1111,
            message: 'OTP Generate Success',
        };
    },

    validateObjectId: (id) => {
        if (ObjectId.isValid(id)) {
            const obj = new ObjectId(id);
            if (obj == id) {
                return true;
            }
        }
        return false;
    },

    validFileSize: (file, type) => {
        const size = file.size;
        if(type == 'images') {
            if(size*config.bytesToMb > 15) {
                return false;
            }
            return true;
        }

        if(type == 'videos') {
            if(size*config.bytesToMb > 50) {
                return false;
            }
            return true;
        }
    },

    uploadFile: function (file, types, fileType) {
        return new Promise((resolve, reject) => {
            console.log('UPLOAD THIS FILE', file);

            var re = /(?:\.([^.]+))?$/;
            var ext = re.exec(file.name)[1];

            if (ext == 'undefined') {
                console.log('FILE EXT UNDEFINED');
                return resolve(false);
            }

            if (types) {
                if (types.indexOf(ext) == -1) {
                    console.log('FILE TYPE NOT ALLOWED', ext);
                    return resolve(false);
                }
            }

            let zzz = `/${fileType}/` +
                        new Date().getTime() +
                        Math.round(Math.pow(36, 10 + 1) - Math.random() * Math.pow(36, 10))
                        .toString(36)
                        .slice(1);
                
            let newFileName = zzz + '.' + ext;

            var mime_type = mime.lookup(newFileName);
            if (!mime_type) {
                console.log('Not a valid mime', newFileName);
                return resolve(false);
            }

            console.log('MIME FOUND', mime_type);


            // Use the mv() method to place the file somewhere on your server
            file.mv('./public' + newFileName, function (err) {
                if (err) {
                    console.log('Error saving file on server', err.message);
                    return resolve(false);
                }
                return resolve(newFileName)
            });
        });
    },
    uploadFileLocal: (file, types) => {
        return new Promise((resolve, reject) => {
            console.log('UPLOAD THIS FILE', file);

            const re = /(?:\.([^.]+))?$/;
            const ext = re.exec(file.name)[1];

            if (ext == 'undefined') {
                console.log('FILE EXT UNDEFINED');
                return resolve(false);
            }

            if (types) {
                if (types.indexOf(ext) == -1) {
                    console.log('FILE TYPE NOT ALLOWED', ext);
                    return resolve(false);
                }
            }

            let zzz =
                '/files/' +
                new Date().getTime() +
                Math.round(Math.pow(36, 10 + 1) - Math.random() * Math.pow(36, 10))
                .toString(36)
                .slice(1);
            let newFileName = zzz + '.' + ext;

            // Use the mv() method to place the file somewhere on your server
            file.mv('./public' + newFileName, function (err) {
                if (err) {
                    console.log('Error saving file on server', err.message);
                    return resolve(false);
                }
                return resolve('/public' + newFileName);
            });
        });
    },

    getDateMY: (date) => {
        // May 1992

        const dat = new Date(date);

        const mon = months[dat.getMonth()];

        const day = dat.getDate() > 9 ? dat.getDate() : '0' + dat.getDate();

        rez = mon + ' ' + dat.getFullYear();

        return rez;
    },

    readableDate: (date) => {
        // 29 May 1992
        const dat = new Date(date);
        const mon = months[dat.getMonth()] ;

        const day = dat.getDate() > 9 ? dat.getDate() : '0' + dat.getDate();

        rez = day + ' ' + mon + ' ' + dat.getFullYear();

        return rez;
    },

    readableDateTime: (date) => {
        // 29 May 1992

        const dat = new Date(date);

        // var mon = months[dat.getMonth()];

        // var day = (dat.getDate() > 9) ? dat.getDate() : "0" + dat.getDate();

        // rez = day + " " + mon + " " + dat.getFullYear();

        return dat.toString();
    },

    getDateDMY: (date) => {
        // 29/11/2017

        var dat = new Date(date);

        var mon = dat.getMonth() + 1;

        var day = dat.getDate() > 9 ? dat.getDate() : '0' + dat.getDate();
        mon = mon > 9 ? mon : '0' + mon;

        rez = day + '/' + mon + '/' + dat.getFullYear();

        return rez;
    },

    getMonthYear: (date) => {
        // May 1992

        const dat = new Date(date);

        const mon = months[dat.getMonth()];

        rez = mon + ' ' + dat.getFullYear();

        return rez;
    },

    getDateYMD: (date) => {
        // 2071/01/03

        const dat = new Date(date);

        const mon = dat.getMonth() + 1;

        const day = dat.getDate() > 9 ? dat.getDate() : '0' + dat.getDate();
        mon = mon > 9 ? mon : '0' + mon;

        rez = dat.getFullYear() + '-' + mon + '-' + day;

        return rez;
    },
    formateDate: function (date) {
        // 7/12/2018 12:25PM
        var dat = new Date(date);
        var mon =
            dat.getMonth() + 1 > 9 ?
            dat.getMonth() + 1 :
            '0' + parseInt(dat.getMonth() + parseInt(1));

        var hours = dat.getHours() % 12;
        hours = hours > 9 ? hours : '0' + hours;

        var minutes = dat.getMinutes();
        minutes = minutes > 9 ? minutes : '0' + minutes;

        var ap = dat.getHours() >= 12 ? 'PM' : 'AM';
        var day = dat.getDate() > 9 ? dat.getDate() : '0' + dat.getDate();

        rez =
            day +
            '/' +
            mon +
            '/' +
            dat.getFullYear() +
            ' ' +
            hours +
            ':' +
            minutes +
            ap;

        return rez;
    },
}