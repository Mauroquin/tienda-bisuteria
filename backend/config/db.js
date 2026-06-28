const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host:     process.env.DB_HOST || 'localhost',
  user:     process.env.DB_USER || 'bisuteria',
  password: process.env.DB_PASS || '123456',
  database: process.env.DB_NAME || 'tienda_bisuteria',
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;
