const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const router = express.Router();
const http = require('http');
const config = require('./config/index');
const server = http.createServer(app);
const fileUpload = require('express-fileupload');
const session = require('express-session');
const error = require('./api/service/error');

app.use(session({
	secret: config.sessionSecret,
	resave: false,
	saveUninitialized: true
}));

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});
  
require('./routes/api')(router);
require('./routes/admin-panel')(router);
require('./routes/index')(router);


/**
 *	Express framework settings 
 **/
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('.html', require('ejs').renderFile);
app.use(fileUpload());
app.use(bodyParser.urlencoded({
	extended: true,
	type: 'application/x-www-form-urlencoded'
}));

app.use(bodyParser.json());


app.use('/', router);
app.use(error);

/**
 *	Server bootup section
 **/
server.listen(config.port, function () {
	console.log("Server listening at PORT:" + config.port);
});

module.exports = server;