import { useCarrito } from '../context/CarritoContext';

export default function ProductoCard({ producto }) {
  const { agregarAlCarrito } = useCarrito();

  return (
    <div style={s.card}>
      <div style={s.imgWrap}>
        {producto.imagen_url
          ? <img src={producto.imagen_url} alt={producto.nombre} style={s.img}/>
          : <div style={s.placeholder}><span style={s.emoji}>💎</span></div>
        }
      </div>
      <div style={s.info}>
        <p style={s.nombre}>{producto.nombre}</p>
        <p style={s.descripcion}>{producto.descripcion}</p> 
        <p style={s.precio}>${Number(producto.precio).toLocaleString('es-CO')}</p>
      </div>
      <button
        style={s.btn}
        onClick={() => agregarAlCarrito(producto)}
        onMouseEnter={e => e.target.style.background = '#c93d60'}
        onMouseLeave={e => e.target.style.background = '#e8547a'}>
        COMPRAR
      </button>
    </div>
  );
}

const s = {
  card: {
    background: '#fff', borderRadius: '4px', overflow: 'hidden',
    boxShadow: '0 1px 6px rgba(0,0,0,0.08)', display: 'flex',
    flexDirection: 'column',
  },
  imgWrap: {
    width: '100%', aspectRatio: '1',
    overflow: 'hidden', background: '#f5f0eb',
  },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  placeholder: {
    width: '100%', height: '100%', display: 'flex',
    alignItems: 'center', justifyContent: 'center', background: '#f5f0eb',
  },
  emoji: { fontSize: '40px' },
  info: { padding: '10px 12px 6px' },
  nombre: {
    fontSize: '13px', fontWeight: '500', color: '#1a1410',
    lineHeight: 1.3, marginBottom: '4px',
  },
  precio: { fontSize: '14px', fontWeight: '700', color: '#1a1410' },
  btn: {
    margin: '0 12px 12px', padding: '10px', background: '#e8547a',
    color: 'white', border: 'none', borderRadius: '2px', fontSize: '12px',
    fontWeight: '700', letterSpacing: '1.5px', cursor: 'pointer',
    transition: 'background 0.2s', fontFamily: "'DM Sans', sans-serif",
  },

  descripcion: {
  fontSize: '11px', color: '#888', lineHeight: 1.4,
  marginBottom: '6px', display: '-webkit-box',
  WebkitLineClamp: 2,        // ← máximo 2 líneas
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
},

};

