'use strict';
var TOKEN_PATH = 'token.json';
const ffmpeg = require('fluent-ffmpeg');
const request = require('request');
const fs = require('fs');

module.exports = function () {

    var showCameraLiveStream = function(req, res) {
        res.writeHeader(200, {
            'Content-Type': 'video/mp4'
        });
        var proc = new ffmpeg('http://ubuy.asuscomm.com:9090/video.cgi')
            //.on('err', function (err, stdout, stderr) {
            //    console.error('cannot process video');
            //})
            .videoCodec('libx264')
            .format('mp4')
            //.duration(duration || 6)
            //.size('50%')
            .pipe(res);
    };

    var get = function (req, res) {
        var token;
        // Check if we have previously stored a token.
        fs.readFile(TOKEN_PATH, function (err, token) {
            if (err) {
                // must log on before go any further
                res.redirect('/auth/google');
            } else {
                token = JSON.parse(token);
                console.log('token read from file', token);
                uploadIpCamImgToCloude(token).then(function (err, response, body) {
                    if (err) {
                        res.send(500);
                    } else {
                        //console.log('successful');
                        res.send(200);
                    }
                });
            }
        });
    };

    ////////////////////////////////////////////////////////////////////////////////////////////
    var uploadIpCamImgToCloude = function (token) {
        var options = {
            url: 'https://www.googleapis.com/upload/drive/v2/files?uploadType=media',
            method: 'POST',
            headers: {
                // query: {uploadType: media},
                'Content-Type': 'image/jpeg',
                //'Content-Type': 'video/h264',
                'authorization': 'Bearer ' + token,
                'title': '1.jpg'
            },
            body: request('http://ubuy.asuscomm.com:9090/image.jpg/'),
            title: '1.jpg'
        };
        return request.post(options);
        /*
        request.post(options, function (err, res, body) {
            if (err) throw err;
            console.log('successful');
            res.send(200);
        });
        */
    };

    var saveVideo = function (duration) {
        ffmpeg('http://ubuy.asuscomm.com:9090/video.cgi')
            .on('err', function (err, stdout, stderr) {
                console.error('cannot process video');
            })
            .videoCodec('mpeg4')
            .format('mp4')
            .duration(duration || 6)
            .size('50%')
            .save('a.mp4');
    };

    return {
        get: get,
        showCameraLiveStream: showCameraLiveStream,
    };

};