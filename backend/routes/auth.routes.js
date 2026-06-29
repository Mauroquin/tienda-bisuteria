const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../config/db");

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res.status(400).json({ ok: false, mensaje: 'Email inválido' });
    if (!password)
      return res.status(400).json({ ok: false, mensaje: 'Contraseña requerida' });
    
    const [results] = await db.query(
      "SELECT * FROM usuarios WHERE email = ?", 
      [email]
    );
    
    if (results.length === 0) {
      return res.status(401).json({ ok: false, mensaje: "Usuario no encontrado" });
    }
    
    const usuario = results[0];
    const passwordValido = await bcrypt.compare(password, usuario.password_hash);
    
    if (!passwordValido) {
      return res.status(401).json({ ok: false, mensaje: "Contraseña incorrecta" });
    }
    
    const token = jwt.sign(
      { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({ 
      ok: true, 
      token, 
      usuario: { 
        id: usuario.id, 
        nombre: usuario.nombre, 
        rol: usuario.rol 
      } 
    });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: err.message });
  }
});

module.exports = router;