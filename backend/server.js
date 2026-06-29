const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

/* ===========================
   CORS
=========================== */

const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : ['http://localhost:3000'];

app.use(cors({
  origin: corsOrigins,
  credentials: true
}));

app.use(express.json());

/* ===========================
   HEALTH CHECK
=========================== */

app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    mensaje: 'API Tienda Bisutería funcionando'
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP'
  });
});

/* ===========================
   RUTAS
=========================== */

app.use('/api/productos', require('./routes/productos'));
app.use('/api/categorias', require('./routes/categorias'));
app.use('/api/pedidos', require('./routes/pedidos'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/clientes', require('./routes/clientes'));

const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

/* ===========================
   ARCHIVOS ESTÁTICOS
=========================== */

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* ===========================
   404
=========================== */

app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada'
  });
});

/* ===========================
   SERVIDOR
=========================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en el puerto ${PORT}`);
});