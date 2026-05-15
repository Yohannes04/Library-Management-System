const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const MemberModel = require('../models/MemberModel');

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. & 2. Query Users by email
    const user = await MemberModel.getUserByEmail(email);

    // 3. If not found, return "Invalid credentials"
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 4. Verify password using bcrypt
    const isMatch = await bcrypt.compare(password, user.Password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 5. Check Status
    if (user.Status === 'Suspended' || user.Status === 'Inactive') {
      return res.status(403).json({ message: 'Account is not active' });
    }

    // 6. Get extended member profile (MaxBooksAllowed, FullName, RoleName)
    const profile = await MemberModel.getMemberProfile(user.UserID);

    // If profile is somehow missing (e.g., they are a User but not a Member)
    if (!profile) {
       return res.status(403).json({ message: 'Member profile not found' });
    }

    // 7. Verify 'Member' role (Mutual exclusivity BR-6)
    if (profile.RoleName !== 'Member') {
      return res.status(403).json({ message: 'Access denied: Members only' });
    }

    // 8. Generate JWT
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
  login
};
