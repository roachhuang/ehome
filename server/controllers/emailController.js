const nodemailer = require('nodemailer');
const mailGun = require('nodemailer-mailgun-transport');
const ffmpeg = require('fluent-ffmpeg');

module.exports = function () {
    var auth = {
        auth: {
            api_key: 'key-74ea0306fc76fbef1bf6de0983d393b7',
            domain: 'sandbox564c281e1d0b438ea440622786079a40.mailgun.org'
        }
    }

    var sendEmail = function (msg) {
        var smtpConfig = {
            service: 'Mailgun',
            //host: 'mail.ajoan.com',
            //port: 25,
            //secureConnection: true,
            //secure: true, // use SSL
            //secureConnection: false, // TLS requires secureConnection to be false
            //service: 'Gmail',
            auth: {
                api_key: 'key-74ea0306fc76fbef1bf6de0983d393b7',
                domain: 'sandbox564c281e1d0b438ea440622786079a40.mailgun.org'
            },
            // don't fail on invalid certs    
            //tls: {rejectUnauthorized: false},
            debug: true
        };

        // create reusable transporter object using the default SMTP transport
        //var smtpTransport = nodemailer.createTransport(smtpConfig);
        var smtpTransport = nodemailer.createTransport(mailGun(auth));

        // setup e-mail data with unicode symbols
        var mailOptions = {
            from: 'smart home <giraftw2002@gmail.com.com>', // sender address
            to: 'giraftw2002@gmail.com', // list of receivers
            priority: 'high',
            subject: 'ehome event', // Subject line
            text: msg, // plaintext body
            html: '<h1>Sensor name: ' + msg + '</h1>', // html body

            attachments: [
                {
                    filename: 'ipcam.jpg',
                    ContentType: 'image/jpeg',
                    path: 'http://ubuy.asuscomm.com:8080/image.jpg'
                }
            ]

        };

        smtpTransport.on('log', console.log);

        /* setup e-mail data with unicode symbols
        var mailOptions = {
            from: 'Smart Home <giraftw2002@gmail.com>', // sender address
            to: 'mark.huang@ca-sec.com', // list of receivers
            priority: 'high',
            subject: 'ehome event', // Subject line
            text: msg, // plaintext body
            html: '<h1>Sensor name: ' + msg + '</h1>', // html body
            attachments: [
                {
                    filename: 'ipcam.mp4',
                    ContentType: 'video/mp4',
                    path: ffmpeg('http://ubuy.asuscomm.com:9090/video.cgi').videoCodec('mpeg4').format('mp4').duration(8).size('50%')
                }
            ]
        };
        */
        // send mail with defined transport object
        smtpTransport.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log('sendMail err: ', error);
            } else {
                console.log('Message sent: ' + info.response);
            }
            smtpTransport.close();
        });
    };
    return { sendEmail: sendEmail };
};
