const mysql = require('mysql2/promise');
require('dotenv').config();

console.log('Database connection details:');
console.log(`Host: ${process.env.DB_HOST || 'localhost'}`);
console.log(`User: ${process.env.DB_USER || 'root'}`);
console.log(`Database: ${process.env.DB_NAME || 'workflow_builder'}`);
// Don't log the password for security

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'workflow_builder',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection immediately
(async () => {
  try {
    await pool.query('SELECT 1');
    console.log('✅ Database connection established successfully');
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    console.error('Please check your database and credentials');
  }
})();

// Helper function to execute SQL queries
async function query(sql, params) {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('Database Query Error:', error);
    throw error;
  }
}

module.exports = {
  query,
  pool
};