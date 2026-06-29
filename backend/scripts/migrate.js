const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const MAX_RETRIES = 10;
const RETRY_DELAY = 3000;

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function migrate() {
  const config = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'bisuteria',
  password: process.env.DB_PASS || '123456',
  database: process.env.DB_NAME || 'tienda_bisuteria',
  multipleStatements: true,
  ssl: process.env.DB_SSL === 'true'
      ? { rejectUnauthorized: false }
      : undefined,
  connectTimeout: 10000,
};

  let connection;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      connection = await mysql.createConnection(config);
      console.log('✅ Conectado a MySQL');
      break;
    } catch (err) {
      console.log(`⏳ Intento ${attempt}/${MAX_RETRIES} — MySQL no disponible: ${err.message}`);
      if (attempt === MAX_RETRIES) {
        console.error('❌ No se pudo conectar a MySQL después de', MAX_RETRIES, 'intentos');
        process.exit(1);
      }
      await sleep(RETRY_DELAY);
    }
  }

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
    process.exit(1);
  }

  await connection.end();
}

migrate();
