import { useEffect, useState } from 'react';
import api from '../api/axios';
import ProductoCard from '../components/ProductoCard';

const CATEGORIAS = [
  { label: 'PULSERAS', id: 2 },
  { label: 'ARETES', id: 1 },
  { label: 'COLLARES', id: 3 },
  { label: 'CONJUNTOS', id: 5 },
];

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [filtro, setFiltro] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarProductos();
  }, [filtro]);

  const cargarProductos = async () => {
    setCargando(true);
    try {
      const params = filtro ? { categoria_id: filtro } : {};
      const { data } = await api.get('/productos', { params });
      setProductos(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={s.page}>
      {/* Media query para escritorio */}
      <style>{`
        @media (min-width: 768px) {
          .productos-grid {
            grid-template-columns: repeat(4, 1fr) !important;
          }
        }
      `}</style>

      {/* Categorías */}
      <div style={s.filtrosWrap}>
        <button
          style={filtro === null ? s.activo : s.filtro}
          onClick={() => setFiltro(null)}
        >
          TODOS
        </button>

        {CATEGORIAS.map(c => (
          <button
            key={c.id}
            style={filtro === c.id ? s.activo : s.filtro}
            onClick={() => setFiltro(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Productos */}
      <div style={s.contenido}>
        {cargando ? (
          <div style={s.mensaje}>Cargando...</div>
        ) : (
          <div style={s.grid} className="productos-grid">
            {productos.map(p => (
              <ProductoCard key={p.id} producto={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: '100vh',
    background: '#fdf8f4',
  },
  filtrosWrap: {
    display: 'flex',
    gap: '8px',
    padding: '12px',
    overflowX: 'auto',
  },
  filtro: {
    padding: '6px 14px',
    borderRadius: '20px',
    border: '1px solid #ccc',
    background: 'white',
    fontSize: '11px',
  },
  activo: {
    padding: '6px 14px',
    borderRadius: '20px',
    background: '#e8547a',
    color: 'white',
    border: 'none',
    fontSize: '11px',
  },
  contenido: {
    padding: '12px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)', // móvil: 2 columnas
    gap: '10px',
  },
  mensaje: {
    textAlign: 'center',
    padding: '40px',
  },
};