'use strict';
//var gDrive = require('google-drive');
var fs = require('fs');
var request = require('request');

var express = require('express');

var router = express.Router();

// here '/' is actually '/users'
router.use('/', function (req, res, next) {
    if (!req.user) {
        res.redirect('/'); // go to home page
    }
    next();
});

var token = null;
/* GET users listing. */
router.get('/', function (req, res) {
    // to do: save token to localstorage or global var for later reference
    // req.user.google.token 
    token = req.user.google.token;
    res.redirect('/');
    //localStorage.setItem('refreshToken', user.google.refreshToken);

    //res.render('users', {user: {name: req.user.displayName,
    //                                  image: req.user.image}});
    //res.sendFile(config.rootPath + '/public/views/users.html');
});

router.get('/saveimage', function () {
    
    
    var options = {
        url: 'https://www.googleapis.com/upload/drive/v2/files?uploadType=media',
        method: 'POST',
        headers: {
            'Content-Type': 'image/jpeg',
            'authorization': 'Bearer ' + token,
            'Title': '1.jpg'
        },
        body: request('http://ubuy.asuscomm.com:8080/image.jpg/')
    }
    // fs.createReadStream('./1.jpg')
    request.post(options, function (err, res, body) {
        if (err) throw err;
        console.log('successful');
    });
    /*
     gDrive(token).files().insert({
        resource: {
            title: get_id() + '.jpg',
            mimeType: 'image/jpg'
        },
        media: {
            mimeType: 'image/jpg',            
            body: fs.createReadStream('http://ubuy.asuscomm.com:8080/image.jpg') // read streams are awesome!
        }
    */

});

module.exports = router;
