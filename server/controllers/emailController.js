var nodemailer = require('nodemailer');

exports.sendEmail = function (req, res) {
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
        priority: 'high',
        subject: 'Intruder', // Subject line
        text: 'Hello world', // plaintext body
        html: '<h1>Hello world</h1>', // html body
        attachements: [
            {
                filename: 'ipcam.jpg',
                content: 'http://ubuy.asuscomm.com:8080/image.jpg'
            }
        ]
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
        res.send(200);
    });
};