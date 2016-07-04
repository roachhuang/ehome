var http = require('http');
var tropo_webapi = require('tropo-webapi');

var server = http.createServer(function (request, response) {

    var tropo = new TropoWebAPI();

    tropo.call("+886922719061");
    tropo.say("Tag, you're it!");

    //to, answerOnMedia, channel, from, headers, name, network, recording, required, timeout
    tropo.call("+886922719061", null, null, null, null, null, "SMS", null, null, null);
    tropo.say("Tag, you're it!!");

    response.end(TropoJSON(tropo));

}).listen(8000); 
