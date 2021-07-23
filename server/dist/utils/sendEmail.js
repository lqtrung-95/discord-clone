"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer = require("nodemailer");
async function sendEmail(to, html) {
    const transporter = nodemailer.createTransport({
        port: 587,
        service: 'gmail',
        secure: true,
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASSWORD,
        },
        debug: true,
    });
    await transporter.sendMail({
        from: `"Discord Team" <${process.env.GMAIL_USER}>`,
        to: to,
        subject: 'Change Password',
        html,
    });
}
exports.sendEmail = sendEmail;
//# sourceMappingURL=sendEmail.js.map