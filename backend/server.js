const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express();

const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(s => s.trim())
  : ['http://localhost:3000'];
app.use(cors({ origin: corsOrigins }));
app.use(express.json());

// 📌 RUTAS
app.use('/api/productos', require('./routes/productos'));
app.use('/api/categorias', require('./routes/categorias'));
app.use('/api/pedidos', require('./routes/pedidos'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/clientes', require('./routes/clientes'));

const authRoutes = require("./routes/auth.routes");
app.use('/api/auth', authRoutes);

// 📌 ARCHIVOS (IMÁGENES)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 📌 SERVIDOR
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
