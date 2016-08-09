
var xbee_api = require('xbee-api');
var util = require('util');
var C = xbee_api.constants;

var xbeeAPI = new xbee_api.XBeeAPI({
  api_mode: 1
});

 var f = {
    type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
    //id: frameId,
    command: 'D0',
    destination64: '0013A20040eb556C',
    commandParameter: [0x04]
  };
  var apiFrame = xbeeAPI.buildFrame(f);
  //console.log(apiFrame.toString());
  //console.log(apiFrame.toString('utf8'));
  console.log('echo -en ' + apiFrame.toString() + ' > /dev/ttyAMA0');
  var f = [0x7e, 0x00, 0x10, 0x17, 0x05, 0x00, 0x13, 0xa2, 0x00];