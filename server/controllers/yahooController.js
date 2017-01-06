const YQL = require('yql');

exports.weather = function (req, res) {
    console.log('yahoo');
    // return celsius
    var query = new YQL("select * from weather.forecast where (woeid = 2306179) and u='c'");
    query.exec(function (err, data) {
        if (!err) {          
            //var location = data.query.results.channel.location;
            //console.log(location);
            //var condition = data.query.results.channel.item.condition;
            //console.log('The current weather in ' + yahoo.location.city + ', ' + yahoo.location.region + ' is ' + yahoo.condition.temp + ' degrees.');
            res.status(200).json(data);
            //console.log(data.query.results.channel.item.forcast);
        } else {
            console.error(err);
            res.status(err);            
        }
    });
};