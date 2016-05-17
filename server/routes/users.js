'use strict';
var express = require('express');
var router = express.Router();

router.use('/', function(req, res, next) {
    if (!req.user) {
        res.direction('/');
    }
    next();
});

/* GET users listing. */
router.get('/', function (req, res) {
    //res.render('users', {user: {name: req.user.displayName,
    //                                  image: req.user.image}});
    res.sendFile(config.rootPath + '/public/views/users.html');
});

module.exports = router;
