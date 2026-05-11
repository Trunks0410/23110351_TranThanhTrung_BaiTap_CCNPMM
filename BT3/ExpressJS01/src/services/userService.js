const bcrypt = require('bcrypt');
const crypto = require('crypto');
const User = require('../models/user');

const registerUser = async (email, password) => {
    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        throw new Error('User already exists');
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const newUser = await User.create({
        email,
        password: hashedPassword
    });

    return newUser;
};

const generateResetToken = async (email) => {
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new Error('User not found');
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set token to expire in 1 hour
    const resetPasswordExpires = Date.now() + 3600000; 

    // Save token in DB
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(resetPasswordExpires);
    await user.save();

    return resetToken; // Return unhashed token to send via email
};

const resetPassword = async (token, newPassword) => {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
        where: {
            resetPasswordToken: hashedToken
        }
    });

    if (!user) {
        throw new Error('Invalid or expired reset token');
    }

    // Check if token expired
    if (user.resetPasswordExpires < new Date()) {
         throw new Error('Invalid or expired reset token');
    }

    // Hash new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update user
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return true;
};

module.exports = {
    registerUser,
    generateResetToken,
    resetPassword
};
