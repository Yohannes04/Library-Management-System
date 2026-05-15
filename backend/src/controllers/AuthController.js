const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const MemberModel = require('../models/MemberModel');
const emailService = require('../services/emailService');

const getLockMessage = (lockedUntil) => {
  const remainingMs = new Date(lockedUntil).getTime() - Date.now();
  const remainingMinutes = Math.max(1, Math.ceil(remainingMs / 60000));
  return `Account locked. Please try again in ${remainingMinutes} minute${remainingMinutes === 1 ? '' : 's'} or use Forgot Password to reset your account.`;
};

const register = async (req, res) => {
  const { fullName, email, password, studentId, department } = req.body;

  try {
    // 1. Basic validation
    if (!fullName || !email || !password || !studentId) {
      return res.status(400).json({ message: 'Please enter all required fields' });
    }

    // 2. Check if user or member already exists
    const existing = await MemberModel.checkExists(email, studentId);
    if (existing.length > 0) {
      const type = existing[0].type;
      return res.status(400).json({ 
        message: type === 'email' ? 'Email already in use' : 'Student ID already registered' 
      });
    }

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Generate verification token
    const verificationToken = uuidv4();

    // 5. Register in DB
    const userId = await MemberModel.registerMember(
      { email, password: hashedPassword, fullName, verificationToken },
      { studentId, department }
    );

    // 6. Send verification email (async, don't block response)
    emailService.sendVerificationEmail(email, verificationToken).catch(console.error);

    res.status(201).json({ 
      message: 'Registration successful! Please check your email to verify your account before logging in.' 
    });

  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({ message: 'Registration failed. Please try again.' });
  }
};

const verifyEmail = async (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res.status(400).json({ message: 'No token provided' });
  }

  try {
    const verified = await MemberModel.verifyEmail(token);
    if (verified) {
      res.json({ message: 'Email verified successfully. You can now log in.' });
    } else {
      res.status(400).json({ message: 'Invalid or expired verification token' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await MemberModel.getUserByEmail(email);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.account_locked_until && new Date(user.account_locked_until) > new Date()) {
      return res.status(423).json({ message: getLockMessage(user.account_locked_until) });
    }

    const isMatch = await bcrypt.compare(password, user.Password);
    if (!isMatch) {
      const failedLogin = await MemberModel.recordFailedLogin(user);
      if (failedLogin.locked) {
        return res.status(423).json({
          message: `Too many incorrect login attempts. Account locked for ${failedLogin.lockMinutes} minutes. Use Forgot Password to reset your account immediately.`
        });
      }

      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check status
    if (user.Status === 'Pending_Verification') {
      return res.status(403).json({ message: 'Please verify your email before logging in.' });
    }
    if (user.Status === 'Suspended' || user.Status === 'Inactive') {
      return res.status(403).json({ message: 'Account is not active' });
    }

    const profile = await MemberModel.getMemberProfile(user.UserID);

    if (!profile) {
       return res.status(403).json({ message: 'Member profile not found' });
    }

    if (profile.RoleName !== 'Member') {
      return res.status(403).json({ message: 'Access denied: Members only' });
    }

    await MemberModel.updateLastLogin(user.UserID);

    const payload = {
      user: {
        UserID: user.UserID,
        MemberID: profile.MemberID,
        FullName: profile.FullName,
        RoleName: profile.RoleName,
        MaxBooksAllowed: profile.MaxBooksAllowed
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: payload.user
        });
      }
    );

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  login,
  register,
  verifyEmail
};
