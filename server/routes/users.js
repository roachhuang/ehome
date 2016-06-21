'use strict';
var fs = require('fs');
var request = require('request');
var express = require('express');
//var mjpegcamera = require('mjpeg-camera');
//var FileOnWrite = require('file-on-write');
// coz windows and linux's path are diff, so we don't specify /.credentitals subfolder here.
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE);
//    '/.credentials/';
//var TOKEN_PATH = TOKEN_DIR + '\token.json';
var TOKEN_PATH = 'token.json';

var router = express.Router();

/*
// here '/' is actually '/users'
router.use('/', function (req, res, next) {
    if (!req.user) {
        res.redirect('/'); // go to home page
    }
    next();
});
*/

/* called from auth route after logon google successful */
router.get('/', function (req, res) {
    var token = req.user.google.token;
    storeToken(token);
    res.redirect('/');
});

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
var storeToken = function (token) {
    try {
        fs.mkdirSync(TOKEN_DIR);
    } catch (err) {
        if (err.code !== 'EEXIST') {
            throw err;
        }
    }
    fs.writeFile(TOKEN_PATH, JSON.stringify(token));
    console.log('Token stored to ' + TOKEN_PATH);
};

router.get('/token', function (req, res) {
    var token;
    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, function (err, token) {
        if (err) {
            // must log on before go any further
            res.json({ token: null });
        } else {
            token = JSON.parse(token);
            console.log('token read from file: ' + token);
            res.json({ token: token });
        }
    });
});
/*
router.get('/saveVideo', function (req, res) {
    // Create a writable stream to generate files 
    var fileWriter = new FileOnWrite({
        path: './frames',
        ext: '.jpeg',
        filename: function (frame) {
            return frame.name + '-' + frame.time;
        },
        transform: function (frame) {
            return frame.data;
        }
    });

    // Create an MjpegCamera instance 
    var camera = new MjpegCamera({
        name: 'backdoor',
        //user: 'admin',
        //password: 'wordup',
        url: 'http://ubuy.asuscomm.com:8080/video.cgi',
        motion: true
    });

    // Pipe frames to our fileWriter so we gather jpeg frames into the /frames folder 
    camera.pipe(fileWriter);

    // Start streaming 
    camera.start();

    // Stop recording after an hour 
    setTimeout(function () {

        // Stahp 
        camera.stop();

        // Get one last frame 
        // Will open a connection long enough to get a single frame and then 
        // immediately close the connection 
        camera.getScreenshot(function (err, frame) {
            fs.writeFile('final.jpeg', frame, process.exit);
        });

    }, 3 * 60 * 1000);
});
*/

router.get('/saveimage', function (req, res) {

    fs.readFile(TOKEN_PATH, function (err, token) {
        if (err) {
            res.redirect('/auth/google');
        } else {
            var options = {
                url: 'https://www.googleapis.com/upload/drive/v2/files?uploadType=media',
                method: 'POST',
                headers: {
                    'Content-Type': 'image/jpeg',
                    'authorization': 'Bearer ' + token,
                    'title': '1.jpg'
                },
                body: request('http://ubuy.asuscomm.com:8080/image.jpg'),
                title: '1.jpg'
            };
            request.post(options, function (err, res, body) {
                if (err) throw err;
                console.log('image saved');
            });
            // send email w/ ipcma img attachment
            //todo: can't set headers after they are sent
            // move email addr to config file?
            res.redirect('/api/email/');
        }
    });
});

module.exports = router;
