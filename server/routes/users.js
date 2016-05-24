'use strict';
var gDrive = require('google-drive');

var express = require('express');
var router = express.Router();
// here '/' is actually '/users'
router.use('/', function (req, res, next) {
    if (!req.user) {
        res.redirect('/'); // go to home page
    }
    next();
});

var token=null;
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
    
    gDrive(token).files().insert('http://ubuy.asuscomm.com:8080/image.jpg', {'uploadType':'media'}, cb);
     
    //gDrive(token).files().list(cb);
    
    function cb(err, res, body) {
        if (err) {
            return console.log('err', err);
        }
        //console.log('response', res)
        //console.log('body', JSON.parse(body))
    }
});

module.exports = router;
