require('dotenv').config();

const bcrypt = require('bcryptjs');
const path = require('path');
const db = require(path.join(__dirname, '..', 'config', 'db'));

async function crearAdmin() {
  try {
    const email = 'admin@aura.com';
    const password = 'Admin123*';

    // Verificar si ya existe
    const [rows] = await db.query(
      'SELECT id FROM usuarios WHERE email = ?',
      [email]
    );

    if (rows.length > 0) {
      console.log('✅ El administrador ya existe.');
      process.exit(0);
    }

    // Encriptar contraseña
    const hash = await bcrypt.hash(password, 10);

    // Crear administrador
    await db.query(
      `INSERT INTO usuarios
      (nombre, email, password_hash, rol)
      VALUES (?, ?, ?, ?)`,
      [
        'Administrador',
        email,
        hash,
        'admin'
      ]
    );

    console.log('🎉 Administrador creado correctamente');
    console.log('------------------------------------');
    console.log('Correo: admin@aura.com');
    console.log('Contraseña: Admin123*');

    process.exit(0);

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

crearAdmin();