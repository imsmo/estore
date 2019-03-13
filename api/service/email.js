const config = require('../../config');
const nodemailer = require('nodemailer');
const ejs = require('ejs');

module.exports = {
    sendResetEmail: (data) => {
        return new Promise((resolve, reject) => {

			ejs.renderFile("./views/reset_link_email.ejs", { name: data.first_name, link: config.live_url + '/prime/reset_password/' + data.reset_token.value }, function (err, edata) {
				let mailOptions = {
					from: '"Camerazi " <' + config.reset_email.auth.user + '>', // sender address
					to: data.email, // list of receivers
					subject: 'E-Store: Password Reset Instructions', // Subject line
					text: 'Hey there, reset your password of your Camerazi Account using this link ' + config.live_url + '/prime/reset_password/' + data.reset_token.value // plain text body
					//html: 'Hey there, reset your password of your IFH Prime Account using this <a href="' + config.live_url + '/prime/reset_password/' + data.reset_token.value + '"> link</a>' // html body
				};	

				if (err)
					console.log("Error in Email Template Render:", err);
				else
					mailOptions.html = edata;
				
				var transporter = nodemailer.createTransport(config.reset_email);

				// send mail with defined transport object
				transporter.sendMail(mailOptions, (error, info) => {
					console.log(error);
					if (error) {
						return resolve(false);
					}
					return resolve(true);
				});

			});
		});
    },

    sendOTPEmail: (data) => {
        return new Promise((resolve, reject) => {

			ejs.renderFile("./views/otp-email-template.ejs", { name: data.name, otp: data.otp }, function (err, edata) {
				
				let mailOptions = {
					from: '"E-Store " <' + config.reset_email.auth.user + '>', // sender address
					to: data.email, // list of receivers
					subject: 'OTP for IFH - Prime account', // Subject line
					text: 'Hey there, your one time password for IFH - Prime account is ' + data.otp, // plain text body
				};

				if (err)
					console.log("Error in Email Template Render:", err);
				else
					mailOptions.html = edata;

				var transporter = nodemailer.createTransport(config.reset_email);

				// send mail with defined transport object
				transporter.sendMail(mailOptions, (error, info) => {
					console.log(error);
					if (error) {
						return resolve(false);
					}
					return resolve(true);
				});
			});

		});
    }
}