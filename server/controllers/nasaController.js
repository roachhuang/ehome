var apod = require('nasa-apod');

exports.pixDaily = function (req, res) {
	//console.log('/apod');
	var client = new apod.Client({
		apiKey: '8q9BFt16841SFP8wBG2RtBfooeNg8ZiPodZQNLdA',
		conceptTags: true
	});

	// Get todays apod data 
	client().then(function (data) {
		res.status(200).json(data);
		//console.log(data);
	});
};