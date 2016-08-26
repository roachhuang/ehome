var nodemailer = require('nodemailer');
module.exports = function (msg) {
    var sendEmail = function (msg) {
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
            subject: 'ehome event', // Subject line
            text: msg, // plaintext body
            html: '<h1>Hello world</h1>', // html body
            attachments: [
                {
                    filename: 'ipcam.jpg',
                    ContentType: 'image/jpeg',
                    path: 'http://ubuy.asuscomm.com:8080/image.jpg'
                }
            ]
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: ' + info.response);
        });
    };

    return { sendEmail: sendEmail };

};