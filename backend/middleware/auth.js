const jwt = require('jsonwebtoken');

exports.verificarToken = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer '))
    return res.status(401).json({ ok: false, mensaje: 'Token requerido' });

  try {
    const token = auth.split(' ')[1];
    req.usuario = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ ok: false, mensaje: 'Token inválido' });
  }
};




exports.soloAdmin = (req, res, next) => {
  if (req.usuario.rol !== 'admin')
    return res.status(403).json({ ok: false, mensaje: 'Acceso denegado' });
  next();
};
