var SerialPort = require('serialport');
var xbee_api = require('xbee-api');
var util = require('util');
var C = xbee_api.constants;

var xbeeAPI = new xbee_api.XBeeAPI({
  api_mode: 2
});

var serialport = new SerialPort('/dev/ttyAMA0', {
  baudrate: 9600,
  parser: xbeeAPI.rawParser(),
  //parser: SerialPort.parsers.raw
  //rtscts: true
});

serialport.on("open", function() {
  console.log('port opened');
});

serialport.on('data', function (data) {
	 console.log('>>' + util.inspect(data));
});

xbeeAPI.on('frame_object', function (frame) {
  console.log('>>' + util.inspect(frame));
});
