module.exports = function (router) {
	router.get('*',function (req, res) {
        console.log("404 Hit");
        res.render('404', {
            'title': 'E-Store'
		});
  });    
}