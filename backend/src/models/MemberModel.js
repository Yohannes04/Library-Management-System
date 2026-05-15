const pool = require('../config/db');

class MemberModel {
  /**
   * Retrieves user credentials by email
   */
  static async getUserByEmail(email) {
    const query = `
      SELECT UserID, Email, Password, FullName, Status, RoleID 
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
}

module.exports = MemberModel;
