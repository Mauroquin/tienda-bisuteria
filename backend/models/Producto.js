const db = require('../config/db');

const Producto = {
  async getAll({ categoria_id, buscar, pagina = 1, limite = 12 }) {
    const offset = (pagina - 1) * limite;
    let sql = `SELECT p.*, c.nombre AS categoria
               FROM productos p
               LEFT JOIN categorias c ON p.categoria_id = c.id
               WHERE p.activo = TRUE`;
    const params = [];
    if (categoria_id) { sql += ' AND p.categoria_id = ?'; params.push(categoria_id); }
    if (buscar)       { sql += ' AND p.nombre LIKE ?';    params.push(`%${buscar}%`); }
    sql += ' ORDER BY p.creado_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limite), Number(offset));
    const [rows] = await db.query(sql, params);
    return rows;
  },

  async getById(id) {
    const [rows] = await db.query(
      `SELECT p.*, c.nombre AS categoria FROM productos p
       LEFT JOIN categorias c ON p.categoria_id = c.id
       WHERE p.id = ?`, [id]
    );
    return rows[0] || null;
  },

  async create(data) {
    const { nombre, descripcion, precio, stock, imagen_url, categoria_id } = data;
    const [result] = await db.query(
      `INSERT INTO productos (nombre, descripcion, precio, stock, imagen_url, categoria_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, descripcion, precio, stock, imagen_url, categoria_id]
    );
    return result.insertId;
  },

  async update(id, data) {
  const { nombre, descripcion, precio, stock, imagen_url, categoria_id } = data;

  let sql = `UPDATE productos SET nombre=?, descripcion=?, precio=?, stock=?, categoria_id=?`;
  const params = [nombre, descripcion, precio, stock, categoria_id];

  if (imagen_url) {          // ← solo actualiza imagen si viene una nueva
    sql += `, imagen_url=?`;
    params.push(imagen_url);
  }

  sql += ` WHERE id=?`;
  params.push(id);

  const [result] = await db.query(sql, params);
  return result.affectedRows;
},

  async delete(id) {
    const [result] = await db.query('UPDATE productos SET activo=FALSE WHERE id=?', [id]);
    return result.affectedRows;
  }
};

module.exports = Producto;
