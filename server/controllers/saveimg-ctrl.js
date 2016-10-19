'use strict';
var TOKEN_PATH = 'token.json';
var ffmpeg = require('fluent-ffmpeg');
var request = require('request');
var fs = require('fs');

module.exports = function () {

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
                uploadIpCamImgToCloude(token);
            }
        });
    };

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
            body: request('http://ubuy.asuscomm.com:8080/image.jpg/'),
            //body: request('http://ubuy.asuscomm.com:8080/video.cgi/'),
            title: '1.jpg'
        };
        request.post(options, function (err, res, body) {
            if (err) throw err;
            console.log('successful');
            res.send(200);
        });
    };
    ////////////////////////////////////////////////////////////////////////////////////////////
    var saveVideo = function (duration) {
        ffmpeg('http://ubuy.asuscomm.com:8080/video.cgi')
            .on('err', function(err, stdout, stderr){
                console.error('cannot process video');
            })
            .videoCodec('mpeg4')
            .format('mp4')
            .duration(duation)
            .size('50%')
            .save('a.mp4');
    }

    return {
        get: get
    };

};