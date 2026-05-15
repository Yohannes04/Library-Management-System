const express = require('express');
const router = express.Router();
const { login } = require('../controllers/AuthController');
const authMiddleware = require('../middleware/AuthMiddleware');

// @route   POST api/auth/login
// @desc    Authenticate member & get token
// @access  Public
router.post('/login', login);

// @route   GET api/auth/me
// @desc    Get current user profile (example of protected route)
// @access  Private (Members only)
router.get('/me', authMiddleware, (req, res) => {
  res.json(req.user);
});

module.exports = router;
