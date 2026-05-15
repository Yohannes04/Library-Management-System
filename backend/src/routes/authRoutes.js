const express = require('express');
const router = express.Router();
const { login, register, verifyEmail } = require('../controllers/AuthController');
const authMiddleware = require('../middleware/AuthMiddleware');

// @route   POST api/auth/register
// @desc    Register a new member
// @access  Public
router.post('/register', register);

// @route   GET api/auth/verify-email
// @desc    Verify member email
// @access  Public
router.get('/verify-email', verifyEmail);

// @route   POST api/auth/login
// @desc    Authenticate member & get token
// @access  Public
router.post('/login', login);

// @route   GET api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', authMiddleware, (req, res) => {
  res.json(req.user);
});

module.exports = router;
