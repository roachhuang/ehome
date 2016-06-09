'use strict';
var TOKEN_PATH = 'token.json';
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
                'authorization': 'Bearer ' + token,
                'title': '1.jpg'
            },
            body: request('http://ubuy.asuscomm.com:8080/image.jpg/'),
            title: '1.jpg'
        };
        request.post(options, function (err, res, body) {
            if (err) throw err;
            console.log('successful');
        });
    };

    return {
        get: get
    };

};