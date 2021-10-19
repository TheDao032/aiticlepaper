const config = require('../config/default.json')
const nodemailer = require("nodemailer");

module.exports = {
    randomCode: async function () {
            return Math.floor(Math.random() * (config.helper.max - config.helper.min) ) + config.helper.min;
    },
    sendMail: async function(subject, text, toEmail)
    {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
              user: config.email.username, // generated ethereal user
              pass: config.email.password, // generated ethereal password
            },
          });

          transporter.sendMail({
            from: config.email.fromEmail, // sender address
            to: `${toEmail}`, // list of receivers
            subject, // Subject line
            text, // plain text body
          });
    },
    
}