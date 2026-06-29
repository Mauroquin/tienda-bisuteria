const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function migrate() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'bisuteria',
    password: process.env.DB_PASS || '123456',
    database: process.env.DB_NAME || 'tienda_bisuteria',
    multipleStatements: true,
  });

  const sqlPath = path.join(__dirname, '../../db/init.sql');
  if (!fs.existsSync(sqlPath)) {
    console.log('⚠️  init.sql no encontrado, saltando migración');
    await connection.end();
    return;
  }

  const sql = fs.readFileSync(sqlPath, 'utf8');
  try {
    await connection.query(sql);
    console.log('✅ Base de datos inicializada correctamente');
  } catch (err) {
    console.error('❌ Error en migración:', err.message);
  }

  await connection.end();
}

migrate();
