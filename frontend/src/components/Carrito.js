import { useState } from 'react';
import { useCarrito } from '../context/CarritoContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const WHATSAPP_NUMBER = '3117766147';

const clienteVacio = {
  nombre_completo: '',
  cedula: '',
  telefono: '',
  correo: '',
  direccion: '',
  ciudad: '',
};

export default function Carrito() {
  const {
    carrito, aumentarCantidad, disminuirCantidad,
    eliminarProducto, vaciarCarrito, total, cantidad,
  } = useCarrito();

  const { usuario } = useAuth();
  const navigate = useNavigate();

  const [abierto, setAbierto] = useState(false);
  const [paso, setPaso] = useState(1);
  const [cargando, setCargando] = useState(false);
  const [cliente, setCliente] = useState(clienteVacio);
  const [errores, setErrores] = useState({});
  const [referencia, setReferencia] = useState('');
  const [metodoPago, setMetodoPago] = useState('nequi');

  const handleCliente = e => {
    const { name, value } = e.target;
    setCliente(prev => ({ ...prev, [name]: value }));
    if (errores[name]) setErrores(prev => ({ ...prev, [name]: '' }));
  };

  const validarPaso2 = () => {
    const e = {};
    if (!cliente.nombre_completo.trim()) e.nombre_completo = 'Requerido';
    if (!cliente.cedula.trim()) e.cedula = 'Requerido';
    if (!cliente.telefono.trim()) e.telefono = 'Requerido';
    if (!/\S+@\S+\.\S+/.test(cliente.correo)) e.correo = 'Correo inválido';
    if (!cliente.direccion.trim()) e.direccion = 'Requerido';
    if (!cliente.ciudad.trim()) e.ciudad = 'Requerido';
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const generarReferencia = () =>
    `bisuteria-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

  const guardarPedidoPendiente = async (ref) => {
    await api.post('/pedidos', {
      referencia: ref,
      estado: 'pendiente',
      items: carrito.map(i => ({
        producto_id: i.id,
        cantidad: i.cantidad,
        precio_unitario: i.precio,
      })),
      total,
      cliente,
      pago: { metodo: metodoPago },
    });
  };

  const confirmarPedido = async () => {
    if (!usuario) {
      navigate('/login');
      return;
    }

    setCargando(true);
    const ref = generarReferencia();
    setReferencia(ref);

    try {
      await guardarPedidoPendiente(ref);

      const mensaje = encodeURIComponent(
        `🛍️ Pedido ${ref}\n\n` +
        `👤 ${cliente.nombre_completo}\n` +
        `📞 ${cliente.telefono}\n` +
        `📍 ${cliente.direccion} - ${cliente.ciudad}\n\n` +
        `🧾 Productos:\n` +
        `${carrito.map(i => `- ${i.nombre} x${i.cantidad}`).join('\n')}\n\n` +
        `💰 Total: $${total.toLocaleString('es-CO')}\n` +
        `💳 Pago: ${metodoPago}`
      );

      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${mensaje}`, '_blank');
      setPaso(4);
    } catch (err) {
      setErrores({ global: 'Error al guardar pedido' });
    } finally {
      setCargando(false);
    }
  };

  const cerrarModal = () => {
    setAbierto(false);
    setPaso(1);
    setCliente(clienteVacio);
    setErrores({});
    setReferencia('');
    setMetodoPago('nequi');
  };

  const titulosPaso = { 1: 'Tu carrito', 2: 'Datos de envío', 3: 'Forma de pago', 4: '¡Listo!' };

  return (
    <>
      <button onClick={() => setAbierto(true)} style={s.flotante}>
        <svg width="22" height="22" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
        {cantidad > 0 && <span style={s.badge}>{cantidad}</span>}
      </button>

      {abierto && (
        <div style={s.overlay} onClick={cerrarModal}>
          <div style={s.panel} onClick={e => e.stopPropagation()}>
            <div style={s.header}>
              <h3 style={s.titulo}>{titulosPaso[paso]}</h3>
              <button onClick={cerrarModal} style={s.cerrar}>✕</button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>

              {/* ── PASO 1: Carrito vacío ── */}
              {paso === 1 && carrito.length === 0 && (
                <div style={s.vacio}>
                  <p style={{ fontSize: '48px' }}>🛍️</p>
                  <p>Tu carrito está vacío</p>
                </div>
              )}

              {/* ── PASO 1: Carrito con items ── */}
              {paso === 1 && carrito.length > 0 && (
                <div>
                  <div style={s.items}>
                    {carrito.map(item => (
                      <div key={item.id} style={s.item}>
                        <div style={s.itemImg}>
                          {item.imagen
                            ? <img src={item.imagen} alt={item.nombre} style={s.img} />
                            : <span>💎</span>}
                        </div>
                        <div style={s.itemInfo}>
                          <p style={s.itemNombre}>{item.nombre}</p>
                          <p style={s.itemPrecio}>${Number(item.precio).toLocaleString('es-CO')}</p>
                        </div>
                        <div style={s.controles}>
                          <button style={s.ctrl} onClick={() => disminuirCantidad(item.id)}>−</button>
                          <span style={s.cant}>{item.cantidad}</span>
                          <button style={s.ctrl} onClick={() => aumentarCantidad(item.id)}>+</button>
                        </div>
                        <button style={s.eliminar} onClick={() => eliminarProducto(item.id)}>✕</button>
                      </div>
                    ))}
                  </div>
                  <div style={s.footer}>
                    <div style={s.totalRow}>
                      <span style={s.totalLabel}>Total</span>
                      <span style={s.totalValor}>${total.toLocaleString('es-CO')}</span>
                    </div>
                    <button
                      style={s.btnPedido}
                      onClick={() => {
                        if (!usuario) { navigate('/login'); return; }
                        setPaso(2);
                      }}
                    >
                      Continuar
                    </button>
                    <button style={s.btnVaciar} onClick={vaciarCarrito}>Vaciar carrito</button>
                  </div>
                </div>
              )}

              {/* ── PASO 2: Datos de envío ── */}
              {paso === 2 && (
                <div style={s.form}>
                  <p style={s.pasoLabel}>Paso 1 de 2 — Datos de envío</p>
                  {[
                    { name: 'nombre_completo', label: 'Nombre completo', type: 'text' },
                    { name: 'cedula', label: 'Cédula', type: 'text' },
                    { name: 'telefono', label: 'Teléfono', type: 'tel' },
                    { name: 'correo', label: 'Correo electrónico', type: 'email' },
                    { name: 'direccion', label: 'Dirección', type: 'text' },
                    { name: 'ciudad', label: 'Ciudad', type: 'text' },
                  ].map(({ name, label, type }) => (
                    <div key={name} style={s.campo}>
                      <label style={s.label}>{label}</label>
                      <input
                        style={{ ...s.input, ...(errores[name] ? s.inputError : {}) }}
                        type={type} name={name} value={cliente[name]}
                        onChange={handleCliente} placeholder={label}
                      />
                      {errores[name] && <span style={s.errorMsg}>{errores[name]}</span>}
                    </div>
                  ))}
                  <div style={s.footer}>
                    <button style={s.btnPedido} onClick={() => { if (validarPaso2()) setPaso(3); }}>
                      Continuar al pago
                    </button>
                    <button style={s.btnVaciar} onClick={() => setPaso(1)}>← Volver al carrito</button>
                  </div>
                </div>
              )}

              {/* ── PASO 3: Forma de pago ── */}
              {paso === 3 && (
                <div style={s.form}>
                  <p style={s.pasoLabel}>Paso 2 de 2 — Forma de pago</p>
                  <div style={s.metodosInfo}>
                    {[
                      { icon: '📱', label: 'Nequi', value: 'nequi', desc: 'Pago por Nequi' },
                      { icon: '📲', label: 'Daviplata', value: 'daviplata', desc: 'Pago por Daviplata' },
                    ].map(m => (
                      <div
                        key={m.value}
                        style={{
                          ...s.metodoCard,
                          ...(metodoPago === m.value ? s.metodoCardActivo : {}),
                        }}
                        onClick={() => setMetodoPago(m.value)}
                      >
                        <span style={{ fontSize: '28px' }}>{m.icon}</span>
                        <div>
                          <p style={s.metodoNombre}>{m.label}</p>
                          <p style={s.metodoDesc}>{m.desc}</p>
                        </div>
                        {metodoPago === m.value && <span style={s.metodoCheck}>✔</span>}
                      </div>
                    ))}
                  </div>

                  <div style={s.resumen}>
                    <span style={s.totalLabel}>Total a pagar</span>
                    <span style={s.totalValor}>${total.toLocaleString('es-CO')}</span>
                  </div>

                  {errores.global && <p style={s.errorMsg}>{errores.global}</p>}

                  <div style={s.footer}>
                    <button
                      style={cargando ? s.btnDisabled : s.btnPedido}
                      onClick={confirmarPedido}
                      disabled={cargando}
                    >
                      {cargando ? 'Preparando pedido...' : '💬 Confirmar por WhatsApp'}
                    </button>
                    <button style={s.btnVaciar} onClick={() => setPaso(2)}>← Volver a datos</button>
                  </div>
                </div>
              )}

              {/* ── PASO 4: Éxito ── */}
              {paso === 4 && (
                <div style={s.exito}>
                  <p style={s.exitoIcon}>✅</p>
                  <p style={s.exitoTexto}>¡Pedido enviado por WhatsApp!</p>
                  <p style={{ fontSize: '13px', color: '#999', textAlign: 'center' }}>
                    Coordinaremos la entrega al <strong>{cliente.telefono}</strong>.<br />
                    Confirma el pago por <strong>{metodoPago}</strong>.
                  </p>
                  {referencia && (
                    <p style={{ fontSize: '11px', color: '#bbb', textAlign: 'center' }}>
                      Referencia: {referencia}
                    </p>
                  )}
                  <button style={s.btnPedido} onClick={cerrarModal}>Cerrar</button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ... objeto `s` sin cambios

const s = {
  flotante: {
    position: 'fixed', bottom: '24px', right: '24px',
    width: '56px', height: '56px', borderRadius: '50%',
    background: '#e8547a', border: 'none', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 4px 16px rgba(232,84,122,0.4)', zIndex: 200,
  },
  badge: {
    position: 'absolute', top: '-4px', right: '-4px',
    background: '#1a1410', color: 'white', borderRadius: '50%',
    width: '20px', height: '20px', fontSize: '11px', fontWeight: '700',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
    zIndex: 9999, display: 'flex', justifyContent: 'flex-end',
  },
  panel: {
    background: 'white', width: '100%', maxWidth: '400px',
    height: '100%', display: 'flex', flexDirection: 'column',
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '20px 20px 16px', borderBottom: '1px solid #f0f0f0',
  },
  titulo: { fontFamily: "'Playfair Display', serif", fontSize: '20px', margin: 0 },
  cerrar: { background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#999' },
  items: { flex: 1, overflowY: 'auto', padding: '12px 20px' },
  item: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '12px 0', borderBottom: '1px solid #f5f5f5',
  },
  itemImg: {
    width: '52px', height: '52px', borderRadius: '8px',
    overflow: 'hidden', background: '#f5f0eb', flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  itemInfo: { flex: 1 },
  itemNombre: { fontSize: '13px', fontWeight: '500', marginBottom: '2px' },
  itemPrecio: { fontSize: '13px', color: '#e8547a', fontWeight: '600' },
  controles: { display: 'flex', alignItems: 'center', gap: '8px' },
  ctrl: {
    width: '26px', height: '26px', borderRadius: '50%',
    border: '1px solid #ddd', background: 'white', cursor: 'pointer',
    fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  cant: { fontSize: '14px', fontWeight: '600', minWidth: '20px', textAlign: 'center' },
  eliminar: { background: 'none', border: 'none', color: '#ccc', cursor: 'pointer', fontSize: '14px' },
  footer: { padding: '20px', borderTop: '1px solid #f0f0f0' },
  totalRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '16px' },
  resumen:  { display: 'flex', justifyContent: 'space-between', marginBottom: '16px', padding: '0 4px' },
  totalLabel: { fontSize: '15px', color: '#666' },
  totalValor: { fontSize: '20px', fontWeight: '700', color: '#1a1410' },
  btnPedido: {
    width: '100%', padding: '14px', background: '#e8547a', color: 'white',
    border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '700',
    cursor: 'pointer', marginBottom: '8px',
  },
  btnDisabled: {
    width: '100%', padding: '14px', background: '#ccc', color: 'white',
    border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '700',
    cursor: 'not-allowed', marginBottom: '8px',
  },
  btnVaciar: {
    width: '100%', padding: '10px', background: 'white', color: '#999',
    border: '1px solid #eee', borderRadius: '8px', fontSize: '13px', cursor: 'pointer',
  },
  vacio: {
    flex: 1, display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    color: '#999', fontSize: '15px', gap: '12px', padding: '48px',
  },
  exito: {
    flex: 1, display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    gap: '12px', padding: '48px',
  },
  exitoIcon: { fontSize: '48px' },
  exitoTexto: { fontSize: '16px', fontWeight: '600', color: '#2e7d32' },
  form: {
    flex: 1, overflowY: 'auto', padding: '20px',
    display: 'flex', flexDirection: 'column', gap: '12px',
  },
  pasoLabel: {
    fontSize: '12px', color: '#e8547a', fontWeight: '600',
    textTransform: 'uppercase', letterSpacing: '0.5px',
  },
  campo: { display: 'flex', flexDirection: 'column', gap: '4px' },
  label: { fontSize: '12px', fontWeight: '600', color: '#555' },
  input: {
    padding: '10px 12px', border: '1px solid #e0e0e0', borderRadius: '8px',
    fontSize: '14px', outline: 'none', transition: 'border 0.2s',
  },
  inputError: { border: '1px solid #e8547a' },
  errorMsg: { fontSize: '11px', color: '#e8547a', marginTop: '2px' },
  metodosInfo: {
    display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '8px',
  },
  metodoCard: {
    display: 'flex', alignItems: 'center', gap: '14px',
    padding: '12px', borderRadius: '10px', background: '#fafafa',
    border: '1px solid #f0f0f0', cursor: 'pointer',
  },
  metodoCardActivo: {
    border: '1.5px solid #e8547a', background: '#fff5f7',
  },
  metodoCheck: {
    marginLeft: 'auto', color: '#e8547a', fontWeight: '700', fontSize: '16px',
  },
  metodoNombre: { fontSize: '14px', fontWeight: '600', margin: 0, marginBottom: '2px' },
  metodoDesc:   { fontSize: '12px', color: '#999', margin: 0 },
};