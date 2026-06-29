const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');

exports.registro = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    if (!nombre || !nombre.trim())
      return res.status(400).json({ ok: false, mensaje: 'El nombre es requerido' });
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res.status(400).json({ ok: false, mensaje: 'Email inválido' });
    if (!password || password.length < 6)
      return res.status(400).json({ ok: false, mensaje: 'La contraseña debe tener al menos 6 caracteres' });

    const existe = await Usuario.buscarPorEmail(email);
    if (existe)
      return res.status(400).json({ ok: false, mensaje: 'El email ya está registrado' });

    const id = await Usuario.crear({ nombre, email, password });
    res.status(201).json({ ok: true, mensaje: 'Usuario creado', id });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await Usuario.buscarPorEmail(email);
    if (!usuario)
      return res.status(401).json({ ok: false, mensaje: 'Credenciales incorrectas' });

    const valido = await Usuario.verificarPassword(password, usuario.password_hash);
    if (!valido)
      return res.status(401).json({ ok: false, mensaje: 'Credenciales incorrectas' });

    const token = jwt.sign(
      { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ ok: true, token, usuario: { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol } });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: err.message });
  }
};

exports.perfil = async (req, res) => {
  try {
    const usuario = await Usuario.buscarPorId(req.usuario.id);
    res.json({ ok: true, data: usuario });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: err.message });
  }
};
