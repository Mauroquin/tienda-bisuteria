const router = require('express').Router();
const db = require('../config/db');
const { verificarToken } = require('../middleware/auth');

// GET /clientes (admin)
router.get('/', verificarToken, async (req, res) => {
  try {
    const [clientes] = await db.query(`
      SELECT * FROM clientes
      ORDER BY creado_at DESC
    `);

    res.json({ ok: true, data: clientes });

  } catch (err) {
    res.status(500).json({ ok: false, mensaje: err.message });
  }
});

module.exports = router;