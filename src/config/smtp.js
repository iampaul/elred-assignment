const { createTransport } = require('nodemailer');
const sendinblueTransport = require('nodemailer-sendinblue-transport');
require('dotenv').config();

const transporter = createTransport( new sendinblueTransport({
    apiKey: process.env.SMTP_API_KEY
}));

module.exports = { 
    transporter 
}
