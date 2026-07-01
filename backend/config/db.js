const mysql = require("mysql2/promise");
require("dotenv").config();

console.log("🔍 DB config:", {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL,
});

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "bisuteria",
  password: process.env.DB_PASS || "123456",
  database: process.env.DB_NAME || "tienda_bisuteria",

  ssl: process.env.DB_SSL === "true"
    ? {
        rejectUnauthorized: false
      }
    : undefined,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;