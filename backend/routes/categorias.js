const router = require('express').Router();
const db = require('../config/db');
const { verificarToken } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM categorias');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: err.message });
  }
});

router.post('/', verificarToken, async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    if (!nombre || !nombre.trim())
      return res.status(400).json({ ok: false, mensaje: 'El nombre de la categoría es requerido' });

    const [result] = await db.query(
      'INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)',
      [nombre.trim(), descripcion || '']
    );
    res.status(201).json({ ok: true, id: result.insertId });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: err.message });
  }
});

router.put('/:id', verificarToken, async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    if (!nombre || !nombre.trim())
      return res.status(400).json({ ok: false, mensaje: 'El nombre de la categoría es requerido' });

    await db.query(
      'UPDATE categorias SET nombre = ?, descripcion = ? WHERE id = ?',
      [nombre.trim(), descripcion || '', req.params.id]
    );
    res.json({ ok: true, mensaje: 'Categoría actualizada' });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: err.message });
  }
});

router.delete('/:id', verificarToken, async (req, res) => {
  try {
    await db.query('DELETE FROM categorias WHERE id = ?', [req.params.id]);
    res.json({ ok: true, mensaje: 'Categoría eliminada' });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: err.message });
  }
});

module.exports = router;