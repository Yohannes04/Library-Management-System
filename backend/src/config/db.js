const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'LibraryManagementDB',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const testConnection = async () => {
  const connection = await pool.getConnection();
  try {
    await connection.ping();
    console.log(`Database connection established: ${process.env.DB_NAME || 'LibraryManagementDB'}`);
  } finally {
    connection.release();
  }
};

module.exports = {
  pool,
  testConnection
};
