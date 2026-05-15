const { pool } = require('../config/db');

class MemberModel {
  /**
   * Retrieves user credentials by email
   */
  static async getUserByEmail(email) {
    const query = `
      SELECT 
        UserID, 
        Email, 
        Password, 
        FullName, 
        Status, 
        RoleID,
        failed_login_attempts,
        account_locked_until
      FROM Users 
      WHERE Email = ?
    `;
    const [rows] = await pool.execute(query, [email]);
    return rows.length ? rows[0] : null;
  }

  /**
   * Retrieves member profile and role information
   */
  static async getMemberProfile(userId) {
    const query = `
      SELECT 
        u.FullName, 
        u.Status, 
        r.RoleName, 
        m.MemberID, 
        m.StudentID, 
        m.MaxBooksAllowed 
      FROM Users u
      JOIN Roles r ON u.RoleID = r.RoleID
      JOIN Members m ON u.UserID = m.UserID
      WHERE u.UserID = ?
    `;
    const [rows] = await pool.execute(query, [userId]);
    return rows.length ? rows[0] : null;
  }

  /**
   * Checks if an email or student ID already exists
   */
  static async checkExists(email, studentId) {
    const query = `
      SELECT 'email' AS type FROM Users WHERE Email = ?
      UNION
      SELECT 'studentId' AS type FROM Members WHERE StudentID = ?
    `;
    const [rows] = await pool.execute(query, [email, studentId]);
    return rows;
  }

  /**
   * Registers a new member within a transaction
   */
  static async registerMember(userData, memberData) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Get or create the Member role needed by new registrations.
      const [roles] = await connection.execute('SELECT RoleID FROM Roles WHERE RoleName = "Member"');
      let roleId = roles[0]?.RoleID;
      if (!roleId) {
        const [roleResult] = await connection.execute(
          'INSERT INTO Roles (RoleName, Description) VALUES (?, ?)',
          ['Member', 'Library member']
        );
        roleId = roleResult.insertId;
      }

      // Insert into Users table
      const userQuery = `
        INSERT INTO Users (Email, Password, FullName, Status, RoleID, VerificationToken) 
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const [userResult] = await connection.execute(userQuery, [
        userData.email,
        userData.password, // This should be hashed
        userData.fullName,
        'Pending_Verification', // Initial status
        roleId,
        userData.verificationToken
      ]);
      const userId = userResult.insertId;

      // Insert into Members table
      const memberQuery = `
        INSERT INTO Members (UserID, StudentID, Department, RegistrationDate, MaxBooksAllowed)
        VALUES (?, ?, ?, CURDATE(), 5)
      `;
      await connection.execute(memberQuery, [
        userId,
        memberData.studentId,
        memberData.department || null
      ]);

      await connection.commit();
      return userId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Finds user by verification token and sets Status to Active
   */
  static async verifyEmail(token) {
    const query = `
      UPDATE Users 
      SET Status = 'Active', VerificationToken = NULL 
      WHERE VerificationToken = ?
    `;
    const [result] = await pool.execute(query, [token]);
    return result.affectedRows > 0;
  }

  /**
   * Updates the user's last successful login timestamp.
   */
  static async updateLastLogin(userId) {
    const query = `
      UPDATE Users
      SET 
        last_login = NOW(), 
        failed_login_attempts = 0,
        account_locked_until = NULL
      WHERE UserID = ?
    `;
    await pool.execute(query, [userId]);
  }

  /**
   * Records a failed login and applies the temporary lockout rules.
   */
  static async recordFailedLogin(user) {
    const currentAttempts = Number(user.failed_login_attempts || 0);
    const nextAttempts = currentAttempts + 1;

    if (nextAttempts >= 5) {
      const lockMinutes = currentAttempts >= 5 ? 60 : 15;
      const query = `
        UPDATE Users
        SET 
          failed_login_attempts = ?,
          account_locked_until = DATE_ADD(NOW(), INTERVAL ? MINUTE)
        WHERE UserID = ?
      `;
      await pool.execute(query, [nextAttempts, lockMinutes, user.UserID]);

      return {
        attempts: nextAttempts,
        locked: true,
        lockMinutes
      };
    }

    const query = `
      UPDATE Users
      SET failed_login_attempts = ?
      WHERE UserID = ?
    `;
    await pool.execute(query, [nextAttempts, user.UserID]);

    return {
      attempts: nextAttempts,
      locked: false,
      remainingAttempts: 5 - nextAttempts
    };
  }
}

module.exports = MemberModel;
