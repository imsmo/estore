const config = require('../../config');
const request = require('request');

module.exports = {

    sendOTP : (mobile, otp) => {
        return new Promise((resolve, reject) => {
            const projectname = "E-Store";
            const message = otp + ' is your OTP (One Time Password) to verify your user account on ' + projectname;

            request.post('https://api.textlocal.in/send/', {
                form: {
                    apikey: config.textLocalKey.apikey,
                    numbers: mobile,
                    message: message,
                    sender: config.textLocalKey.sender
                }
            }, 
            function (error, response, body) {
                if (response.statusCode == 200) {
                    console.log('Response:', body);
                    var body_obj = JSON.parse(body);
                    if (body_obj.status == 'success') {
                        console.log("OTP Sent!");
                        return resolve(true);
                    } else {
                        return resolve(false);
                    }
                } else {
                    console.log("Server Error", body);
                    return resolve(false);
                }
            });
        });
    } 

}