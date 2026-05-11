const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendResetEmail = async (toEmail, token) => {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: toEmail,
        subject: 'Password Reset Request',
        html: `
            <h3>Password Reset Request</h3>
            <p>You requested to reset your password. Click the link below to reset it:</p>
            <a href="${resetUrl}">${resetUrl}</a>
            <p>This link will expire in 1 hour.</p>
            <p>If you did not request this, please ignore this email.</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Password reset email sent to:', toEmail);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Could not send reset email');
    }
};

module.exports = {
    sendResetEmail
};
