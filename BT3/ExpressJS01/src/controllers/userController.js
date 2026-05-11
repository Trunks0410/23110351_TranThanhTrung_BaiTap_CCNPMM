const userService = require('../services/userService');
const emailService = require('../services/emailService');

const handleRegister = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Missing email or password' });
        }
        
        await userService.registerUser(email, password);
        return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const handleForgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
             return res.status(400).json({ message: 'Missing email' });
        }

        const resetToken = await userService.generateResetToken(email);
        await emailService.sendResetEmail(email, resetToken);

        return res.status(200).json({ message: 'Password reset link sent to your email' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const handleResetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ message: 'Missing new password' });
        }

        await userService.resetPassword(token, password);
        
        return res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    handleRegister,
    handleForgotPassword,
    handleResetPassword
};
