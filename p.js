var SerialPort = require('serialport');
var xbee_api = require('xbee-api');
var C = xbee_api.constants;
var Q = require('q');
var util = require('util');
// following settings work for me on my Raspberry pi, your config may differ!

var xbeeAPI = new xbee_api.XBeeAPI({
    api_mode: 1
    //module: 'Zigbee',
    //raw_frames: true
});
var serialport = new SerialPort("/dev/ttyAMA0", {
    baudrate: 9600,
    parser: xbeeAPI.rawParser(),
}, function (err) {
    if (err) {
        return console.log('Error: ', err.message);
    }
});

// How long are we prepared to wait for a response to our command?
var maxWait = 5000; // ms
function xbeeCommand(frame) {
    // set frame id
    frame.id = xbeeAPI.nextFrameId();

    // We're going to return a promise
    var deferred = Q.defer();

    var callback = function (receivedFrame) {
        console.log('get API frame: ', util.inspect(receivedFrame));
        if (receivedFrame.id == frame.id) {
            // This is our frame's response. Resolve the promise.
            deferred.resolve(receivedFrame);
        }
    };

    // Clear up: remove listener after the timeout and a bit, it's no longer needed
    setTimeout(function () {
        xbeeAPI.removeListener("frame_object", callback);
    }, maxWait + 1000);

    // Attach callback so we're waiting for the response
    console.log('xbeeAPI :', util.inspect(xbeeAPI));
    xbeeAPI.on("frame_object", callback);

    // Pass the bytes down the serial port
    console.log('frame: ', util.inspect(frame));

    serialport.write(xbeeAPI.buildFrame(frame), function (err) {
        console.log(util.inspect(xbeeAPI.buildFrame(frame)));
        if (err) throw (err);
        else {
            console.log(err);
        }
    });

    // Return our promise with a timeout
    return deferred.promise.timeout(maxWait);
}


serialport.on('open', function () {
    console.log('port opened.');
    /*
    var frame_obj = { // AT Request to be sent to
        type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
        remote64: '000000000000FFFF',
        command: "NI",
        commandParameter: [],
    };
    serialport.write(xbeeAPI.buildFrame(frame_obj), function (err) {
        if (err) {
            return console.log('Error on write: ', err.message);
        }
        console.log('message written');
    });
    */
    xbeeCommand({
        type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
        destination64: '0013A20040EB556C',
        command: "%V",
        commandParameter: []
    }).then(function (f) {
        console.log("Command successful:", f);
    }).catch(function (e) {
        console.log("Command failed:", e);
    });

});
xbeeAPI.on("frame_object", function (frame) {
    console.log(">>", frame);
    serialport.close();
});


serialport.on('error', function (err) {
    console.log('Error: ', err.message);
});



/*
xbeeCommand({
    type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
    destination64: '0013a20040eb556c',
    command: "DB",
    commandParameter: [],
}).then(function (f) {
    console.log("Command successful:", f);
}).catch(function (e) {
    console.log("Command failed:", e);
});
*/