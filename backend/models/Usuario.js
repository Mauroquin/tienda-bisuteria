const db = require('../config/db');
const bcrypt = require('bcryptjs');

const Usuario = {
  async crear({ nombre, email, password, rol = 'cliente' }) {
    const hash = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      `INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES (?, ?, ?, ?)`,
      [nombre, email, hash, rol]
    );
    return result.insertId;
  },

  async buscarPorEmail(email) {
    const [rows] = await db.query(
      `SELECT * FROM usuarios WHERE email = ?`, [email]
    );
    return rows[0] || null;
  },

  async buscarPorId(id) {
    const [rows] = await db.query(
      `SELECT id, nombre, email, rol, creado_at FROM usuarios WHERE id = ?`, [id]
    );
    return rows[0] || null;
  },

  async verificarPassword(password, hash) {
    return bcrypt.compare(password, hash);
  }
};

module.exports = Usuario;
