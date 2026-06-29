const Producto = require('../models/Producto');

const baseUrl = process.env.BASE_URL || '';

exports.getAll = async (req, res) => {
  try {
    const productos = await Producto.getAll(req.query);
    res.json({ ok: true, data: productos });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const producto = await Producto.getById(req.params.id);
    if (!producto) return res.status(404).json({ ok: false, mensaje: 'Producto no encontrado' });
    res.json({ ok: true, data: producto });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { nombre, precio } = req.body;
    if (!nombre || !nombre.trim())
      return res.status(400).json({ ok: false, mensaje: 'El nombre del producto es requerido' });
    if (precio === undefined || precio === '' || Number(precio) < 0)
      return res.status(400).json({ ok: false, mensaje: 'Precio inválido' });

    const imagen_url = req.file
      ? `${baseUrl}/uploads/${req.file.filename}`
      : null;
    const id = await Producto.create({ ...req.body, imagen_url });
    res.status(201).json({ ok: true, id });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, precio } = req.body;
    if (!nombre || !nombre.trim())
      return res.status(400).json({ ok: false, mensaje: 'El nombre del producto es requerido' });
    if (precio !== undefined && (precio === '' || Number(precio) < 0))
      return res.status(400).json({ ok: false, mensaje: 'Precio inválido' });

    const imagen_url = req.file
      ? `${baseUrl}/uploads/${req.file.filename}`
      : null;

    await Producto.update(id, { ...req.body, imagen_url });

    res.json({ ok: true, mensaje: 'Producto actualizado' });
  } catch (error) {
    console.error("ERROR UPDATE:", error);
    res.status(500).json({ mensaje: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    await Producto.delete(req.params.id);
    res.json({ ok: true, mensaje: 'Producto eliminado' });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: err.message });
  }
};
