var nodemailer = require('nodemailer');

exports.sendEmail = function() {
    var smtpConfig = {
        service: 'gmail',
        auth: {
            user: 'giraftw2002@gmail.com',
            pass: '0916@tpe'
        }
    };

    // create reusable transporter object using the default SMTP transport 
    var transporter = nodemailer.createTransport(smtpConfig);

    // setup e-mail data with unicode symbols 
    var mailOptions = {
        from: 'smart home <giraftw2002@gmail.com>', // sender address 
        to: 'mark.huang@ca-sec.com', // list of receivers 
        subject: 'Intruder', // Subject line 
        text: 'Hello world', // plaintext body 
        html: '<b>Hello world</b>' // html body 
    };

    // send mail with defined transport object 
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
};