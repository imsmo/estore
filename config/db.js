const db_config = function () {
    
    this.live_url = "http://192.168.2.129:5000";
    this.database = 'e-store';
    this.username = encodeURIComponent('camer@z!');
    this.password = encodeURIComponent('camer@z!2018');
    this.host = 'ds245082.mlab.com';
    this.port = '45082';
    this.authSource = 'e-store';
    
    // test database local
    this.localdatabase = 'E-Store_dev';
    this.localusername = null;
    this.localpassword = null;
    this.localhost = 'localhost';
    this.localport = '27017';
    this.localauthSource = 'e-store';
};

module.exports = new db_config();
