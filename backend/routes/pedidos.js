const router = require('express').Router();
const db = require('../config/db');
const { verificarToken } = require('../middleware/auth');

// POST /pedidos — crear pedido con datos de cliente y forma de pago
router.post('/', verificarToken, async (req, res) => {
  const { items, total, cliente, pago } = req.body;

  // ── Validaciones ──────────────────────────────────────────
  if (!items?.length)
    return res.status(400).json({ ok: false, mensaje: 'El carrito está vacío' });

  if (!cliente?.nombre_completo || !cliente?.cedula ||
      !cliente?.telefono      || !cliente?.correo  ||
      !cliente?.direccion     || !cliente?.ciudad)
    return res.status(400).json({ ok: false, mensaje: 'Faltan datos del cliente' });

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cliente.correo))
    return res.status(400).json({ ok: false, mensaje: 'Correo electrónico inválido' });

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // 1. Insertar cliente
    const [clienteResult] = await conn.query(
      `INSERT INTO clientes
          (usuario_id, nombre_completo, cedula, telefono, correo, direccion, ciudad)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        req.usuario.id,
        cliente.nombre_completo,
        cliente.cedula,
        cliente.telefono,
        cliente.correo,
        cliente.direccion,
        cliente.ciudad,
      ]
    );
    const cliente_id = clienteResult.insertId;

    // 2. Insertar pedido
    const [pedidoResult] = await conn.query(
      `INSERT INTO pedidos (usuario_id, cliente_id, total, estado)
        VALUES (?, ?, ?, 'pendiente')`,
      [req.usuario.id, cliente_id, total]
    );
    const pedido_id = pedidoResult.insertId;

    // 3. Insertar detalle + descontar stock
    for (const item of items) {
      await conn.query(
        `INSERT INTO detalle_pedido (pedido_id, producto_id, cantidad, precio_unitario)
          VALUES (?, ?, ?, ?)`,
        [pedido_id, item.producto_id, item.cantidad, item.precio_unitario]
      );
      await conn.query(
        `UPDATE productos SET stock = stock - ? WHERE id = ?`,
        [item.cantidad, item.producto_id]
      );
    }

    // 4. Insertar pago
    await conn.query(
      `INSERT INTO pagos (pedido_id, estado, metodo) VALUES (?, 'pendiente', ?)`,
      [pedido_id, pago?.metodo || null]
    );

    await conn.commit();

    // 🧾 Construir mensaje WhatsApp
    const listaProductos = items.map(i => 
      `• ${i.nombre} x${i.cantidad} - $${i.precio_unitario}`
    ).join('%0A');

    const mensaje = `🛍️ *Nuevo Pedido*%0A
👤 Cliente: ${cliente.nombre_completo}%0A
📞 Tel: ${cliente.telefono}%0A
📍 Dirección: ${cliente.direccion}%0A
%0A📦 Productos:%0A${listaProductos}%0A
%0A💰 Total: $${total}%0A
📌 Estado: pendiente`;

    const whatsapp_num = process.env.WHATSAPP_BUSINESS || '573117766147';
    const whatsapp_url = `https://wa.me/${whatsapp_num}?text=${mensaje}`;

    res.status(201).json({
      ok: true,
      pedido_id,
      whatsapp_url
    });

  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ ok: false, mensaje: err.message });
  } finally {
    conn.release();
  }
});

// GET /pedidos/mis-pedidos — historial con cliente y pago
router.get('/mis-pedidos', verificarToken, async (req, res) => {
  try {
    const [pedidos] = await db.query(`
      SELECT 
        p.id, p.total, p.estado, p.creado_at,
        c.nombre_completo, c.cedula, c.telefono,
        c.correo, c.direccion, c.ciudad
      FROM pedidos p
      JOIN clientes c ON c.id = p.cliente_id
      WHERE p.usuario_id = ?
      ORDER BY p.creado_at DESC
    `, [req.usuario.id]);

    res.json({ ok: true, data: pedidos });

  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, mensaje: err.message });
  }
});

// GET /pedidos/:id — detalle completo
router.get('/:id', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;

    const [pedido] = await db.query(`
      SELECT 
        p.id, p.total, p.estado, p.creado_at,
        c.nombre_completo, c.cedula, c.telefono,
        c.correo, c.direccion, c.ciudad
      FROM pedidos p
      JOIN clientes c ON c.id = p.cliente_id
      WHERE p.id = ?
    `, [id]);

    const [productos] = await db.query(`
      SELECT 
        pr.nombre,
        dp.cantidad,
        dp.precio_unitario,
        (dp.cantidad * dp.precio_unitario) AS subtotal
      FROM detalle_pedido dp
      JOIN productos pr ON pr.id = dp.producto_id
      WHERE dp.pedido_id = ?
    `, [id]);

    res.json({
      ok: true,
      data: {
        pedido: pedido[0],
        productos
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, mensaje: err.message });
  }
});

// GET /pedidos/:id/seguimiento — historial de seguimiento
router.get('/:id/seguimiento', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    const [pedido] = await db.query(
      `SELECT estado, creado_at FROM pedidos WHERE id = ?`,
      [id]
    );
    if (!pedido.length)
      return res.status(404).json({ ok: false, mensaje: 'Pedido no encontrado' });

    const timeline = [{
      estado: pedido[0].estado,
      fecha: pedido[0].creado_at
    }];

    res.json({ ok: true, data: timeline });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, mensaje: err.message });
  }
});

// PUT /pedidos/:id — actualizar estado del pedido (ADMIN)
router.put('/:id', verificarToken, async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  try {
    await db.query(
      `UPDATE pedidos SET estado = ? WHERE id = ?`,
      [estado, id]
    );

    res.json({ ok: true, mensaje: 'Estado actualizado' });

  } catch (err) {
    res.status(500).json({ ok: false, mensaje: err.message });
  }
});

// GET /pedidos — ADMIN (todos los pedidos)
router.get('/', verificarToken, async (req, res) => {
  try {
    const [pedidos] = await db.query(`
      SELECT 
        p.id, 
        p.total, 
        p.estado, 
        p.creado_at,
        c.nombre_completo AS nombre_cliente,
        c.telefono,
        c.correo,
        c.direccion,
        p.direccion_envio,
        pa.estado AS estado_pago,
        GROUP_CONCAT(pr.nombre SEPARATOR ', ') AS productos
      FROM pedidos p
      JOIN clientes c ON c.id = p.cliente_id
      LEFT JOIN pagos pa ON pa.pedido_id = p.id
      JOIN detalle_pedido dp ON dp.pedido_id = p.id
      JOIN productos pr ON pr.id = dp.producto_id
      GROUP BY 
        p.id,
        p.total,
        p.estado,
        p.creado_at,
        c.nombre_completo,
        c.telefono,
        c.correo,
        c.direccion,
        p.direccion_envio,
        pa.estado
      ORDER BY p.creado_at DESC
    `);

    res.json({ ok: true, data: pedidos });

  } catch (err) {
    res.status(500).json({ ok: false, mensaje: err.message });
  }
});

module.exports = router;
