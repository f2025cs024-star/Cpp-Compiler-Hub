const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: Number(process.env.AUTH_RATE_LIMIT_MAX) || 25,
    message: { msg: 'Too many attempts. Try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

router.post('/register', authLimiter, authController.register);
router.post('/login', authLimiter, authController.login);
router.get('/user', auth, authController.getUser);

module.exports = router;
