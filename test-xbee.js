var SerialPort = require('serialport');
var xbee_api = require('xbee-api');
var util = require('util');
var C = xbee_api.constants;

var xbeeAPI = new xbee_api.XBeeAPI({
  api_mode: 1
});

var serialport = new SerialPort('COM4', {     // this line is for testing on PC
  //var serialport = new SerialPort('/dev/ttyAMA0', {
  baudrate: 9600,
  parser: xbeeAPI.rawParser(),
  //parser: SerialPort.parsers.raw
  //rtscts: true
});

serialport.on("open", function () {
  console.log('port opened');
  var f = {
    type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
    //id: frameId,
    command: 'D0',
    destination64: '0013A20040eb556C',
    commandParameter: [0x04]
  };
  var apiFrame = xbeeAPI.buildFrame(f);
  console.log(apiFrame.toString());
  var f = [0x7e, 0x00, 0x10, 0x17, 0x05, 0x00, 0x13, 0xa2, 0x00];

  /*
  var a = '';
  for (var i = 0; i < f.length; i += 2) {
      a = a.concat('\\x');
      a = a.concat(f.slice(i, i + 2));
  }

  */
  console.log('echo -en' + apiFrame + ' > /dev/ttyAMA0');
});

serialport.on('data', function (data) {
	 console.log('>>' + util.inspect(data));
});

xbeeAPI.on('frame_object', function (frame) {
  console.log('>>' + util.inspect(frame));
});
