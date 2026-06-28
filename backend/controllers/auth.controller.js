const db = require("../config/db");
const bcrypt = require("bcryptjs");
const { generarToken } = require("../config/jwt");

exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM usuarios WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) return res.status(500).json(err);

      if (results.length === 0) {
        return res.status(401).json({ mensaje: "Usuario no encontrado" });
      }

      const usuario = results[0];

      const passwordValido = await bcrypt.compare(
        password,
        usuario.password
      );

      if (!passwordValido) {
        return res.status(401).json({ mensaje: "Contraseña incorrecta" });
      }

      const token = generarToken(usuario);

      res.json({
        token,
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          rol: usuario.rol,
        },
      });
    }
  );
};