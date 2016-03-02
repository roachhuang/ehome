var YQL = require('yql');
module.exports = function() {
	// return celsius
	var query = new YQL("select * from weather.forecast where (woeid = 2306179) and u='c'");
	query.exec(function(err, data) {
		var location = data.query.results.channel.location;
		console.log(location);
		var condition = data.query.results.channel.item.condition;
		console.log('The current weather in ' + location.city + ', ' + location.region + ' is ' + condition.temp + ' degrees.');
	});
};