'use strict';
var express = require('express');
var router = express.Router();
// here '/' is actually '/users'
router.use('/', function(req, res, next) {
    if (!req.user) {
        res.direct('/'); // go to home page
    }
    next();
});

/* GET users listing. */
router.get('/', function (req, res) {
    // to do: save token to localstorage or global var for later reference
    // req.user.google.token 
        
    //res.render('users', {user: {name: req.user.displayName,
    //                                  image: req.user.image}});
    //res.sendFile(config.rootPath + '/public/views/users.html');
});

module.exports = router;
