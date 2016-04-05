var gpioController = function (gpioService) {
	var middleware = function (req, res, next) {
		//if (!re.user) {
		//res.redirect('/');
		//}
		next();
	}
	return {
		middleware: middleware;
	}
}

module.exports = gpioController;