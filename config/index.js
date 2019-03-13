const db = require('./db');

const config = function () {

	this.live_url = db.live_url;

	this.dbLocal = {
		'database': db.localdatabase,
		'username': db.localusername,
		'password': db.localpassword,
		'host': db.localhost,
		'authSource': db.localauthSource,
		'port': db.localport
	};
	
	this.dbTest = {
		'database': db.database,
		'username': db.username,
		'password': db.password,
		'host': db.host,
		'authSource': db.authSource,
		'port': db.port
	};
	

	this.firebase_token = "WEB_FIREBASE_TOKEN";
	
	this.genderArray = ["male","female"];

	this.registerType = ["email", "facebook"];

	this.deviceType = ["ios", "android"];

	this.port = process.env.PORT || 5000;

	this.apiSecret = "gh^sahg$#sabghjq9&g7safg76";

	this.OPT_EXPIRED_IN_MINUTES = 5;

	this.mime_type = ['jpg', 'png', 'jpeg', 'avi', 'mp4', 'flv']; 

	this.videoFile = 'videos';
	
	this.imageFile = 'images';

	this.bytesToMb = 0.000001;


	// this.reset_email = {
	// 	host: 'smtp.gmail.com',
	// 	port: 587,
	// 	secure: false,
	// 	auth: {
	// 		user: "test.capermint@gmail.com",
	// 		pass: "Capermint@test1234"
	// 	}
	// };

	// this.AWS_S3_BUCKET = {
	// 	'key':'AKIAIO72DPI37NKCG6SQ',
	// 	'secret':'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',
	// 	'name':'practicaltestcapermint',
	// 	'region':'us-east-2'
	// };

	// this.default_user_pic = "https://practicaltestcapermint.s3.amazonaws.com/default_user.png";

	this.sessionSecret = 'topSecretSessionKey';

	// this.default_credits = 150;

	this.firebaseKey = "AAAAPeU-UWo:APA91bFVFBHbl8z4m_ZUC_jfF8QikmgG7VDNeTPSunI-_46S4DxMXz1Ug-X2qFUXnOzhTay4DnXya3nj5JaYz0YMZGfu5OCzbC-Q116bUIDtTill6222B0izJVV9SOvMDSMYaSa18lTl";

	this.pre = (this.port == 5000) ? 'http://' : 'http://';


	//For OTP SMS
	// this.textLocalKey = {
	// 	'apikey': 'nHm6A+Unu6E-gKUNHTTLkMglLqTy5qHlQurSMK4OJ9',
	// 	'sender': 'Camerazi'
	// }; 
	
	// //For Google Map(GeoCoder)
	// this.googleMap = {
	// 	'apikey': 'AIzaSyBuA4x1ATOUZL0bKmmg6ha67053SeGmNh8'		
	// };
	
	this.otp_length = 4;
};

module.exports = new config();