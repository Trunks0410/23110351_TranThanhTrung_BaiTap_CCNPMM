const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/register', userController.handleRegister);
router.post('/forgot-password', userController.handleForgotPassword);
router.post('/reset-password/:token', userController.handleResetPassword);

module.exports = router;
