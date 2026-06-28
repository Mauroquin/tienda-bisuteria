// src/pages/Admin.jsx
import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
  *{box-sizing:border-box}
  .shell{display:flex;min-height:640px;background:#f3f4f6;border-radius:12px;overflow:hidden;font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif}
  .nav{width:200px;background:white;border-right:0.5px solid #e5e7eb;display:flex;flex-direction:column;flex-shrink:0}
  .nav-logo{padding:14px 16px;border-bottom:0.5px solid #e5e7eb}
  .logo-name{font-size:13px;font-weight:600;color:#111}
  .logo-tag{font-size:10px;color:#9ca3af;margin-top:1px}
  .nav-sec{padding:12px 12px 3px;font-size:10px;color:#9ca3af;letter-spacing:.4px;font-weight:500}
  .nitem{display:flex;align-items:center;gap:8px;padding:7px 12px;border-radius:8px;margin:1px 6px;cursor:pointer;font-size:12px;color:#6b7280;transition:all .15s}
  .nitem:hover{background:#f9fafb;color:#111}
  .nitem.active{background:#fdf0f3;color:#b83458}
  .nitem svg{width:14px;height:14px;flex-shrink:0}
  .nbadge{margin-left:auto;font-size:10px;background:#fdf0f3;color:#b83458;padding:1px 5px;border-radius:8px;font-weight:600}
  .nbadge.pulse{animation:pulse 1.5s infinite}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
  .nav-foot{margin-top:auto;padding:10px 12px;border-top:0.5px solid #e5e7eb;font-size:11px;color:#9ca3af}
  .main{flex:1;display:flex;flex-direction:column;min-width:0}
  .topbar{background:white;border-bottom:0.5px solid #e5e7eb;padding:10px 18px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0}
  .tbar-left{display:flex;align-items:center;gap:10px}
  .tbar-title{font-size:14px;font-weight:600;color:#111}
  .mode-badge{font-size:10px;padding:2px 8px;border-radius:10px;background:#fdf0f3;color:#b83458;border:0.5px solid #f4c0d1;font-weight:500}
  .tbar-right{display:flex;gap:7px;align-items:center}
  .btn-p{padding:6px 13px;background:#c0405f;color:white;border:none;border-radius:8px;font-size:12px;font-weight:500;cursor:pointer;transition:background .15s}
  .btn-p:hover{background:#a8334f}
  .btn-s{padding:6px 13px;background:transparent;color:#6b7280;border:0.5px solid #d1d5db;border-radius:8px;font-size:12px;cursor:pointer;transition:all .15s}
  .btn-s:hover{background:#f9fafb;color:#111}
  .btn-wa{padding:6px 13px;background:#25d366;color:white;border:none;border-radius:8px;font-size:12px;font-weight:500;cursor:pointer;display:flex;align-items:center;gap:5px;transition:background .15s}
  .btn-wa:hover{background:#1da851}
  .btn-print{padding:6px 13px;background:#6b7280;color:white;border:none;border-radius:8px;font-size:12px;font-weight:500;cursor:pointer;transition:background .15s}
  .btn-print:hover{background:#4b5563}
  .body{flex:1;overflow-y:auto;padding:14px 18px}
  .panel{display:none}.panel.on{display:block}
  .two-col{display:grid;grid-template-columns:1fr 1fr;gap:12px}
  .three-col{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}
  .card{background:white;border:0.5px solid #e5e7eb;border-radius:12px;padding:14px;margin-bottom:12px}
  .card-title{font-size:12px;font-weight:600;color:#111;margin-bottom:12px}
  .field{display:flex;flex-direction:column;gap:4px;margin-bottom:10px}
  .flabel{font-size:10px;color:#9ca3af;letter-spacing:.3px;font-weight:500}
  .finput{padding:8px 10px;border:0.5px solid #e5e7eb;border-radius:8px;font-size:12px;background:#f9fafb;color:#111;outline:none;font-family:inherit;width:100%}
  .finput:focus{border-color:#c0405f;background:white}
  .ftextarea{padding:8px 10px;border:0.5px solid #e5e7eb;border-radius:8px;font-size:12px;background:#f9fafb;color:#111;outline:none;font-family:inherit;resize:vertical;min-height:64px;width:100%}
  .fselect{padding:8px 10px;border:0.5px solid #e5e7eb;border-radius:8px;font-size:12px;background:#f9fafb;color:#111;outline:none;font-family:inherit;width:100%}
  .upload-zone{border:1.5px dashed #d1d5db;border-radius:8px;padding:18px;text-align:center;cursor:pointer;color:#9ca3af;font-size:12px}
  .upload-zone:hover{border-color:#c0405f;background:#fdf0f3}
  table{width:100%;border-collapse:collapse;font-size:12px}
  th{text-align:left;padding:7px 10px;font-size:10px;color:#9ca3af;border-bottom:0.5px solid #e5e7eb;font-weight:500;letter-spacing:.3px}
  td{padding:8px 10px;border-bottom:0.5px solid #e5e7eb;color:#111;vertical-align:middle}
  tr:last-child td{border-bottom:none}
  tr:hover td{background:#fafafa}
  .badge{display:inline-block;padding:2px 7px;border-radius:8px;font-size:10px;font-weight:500}
  .b-ok{background:#e8f5e9;color:#2e7d32}
  .b-warn{background:#fff3e0;color:#e65100}
  .b-err{background:#fce4ec;color:#c62828}
  .b-blue{background:#e3f2fd;color:#1565c0}
  .b-gray{background:#f3f4f6;color:#6b7280}
  .b-purple{background:#ede7f6;color:#4527a0}
  .b-pink{background:#fdf0f3;color:#b83458}
  .arow{display:flex;gap:5px;flex-wrap:wrap}
  .abtn{padding:3px 9px;font-size:11px;border:0.5px solid #e5e7eb;border-radius:8px;background:transparent;color:#6b7280;cursor:pointer;transition:all .15s}
  .abtn:hover{background:#f3f4f6;color:#111}
  .abtn.d{color:#c62828;border-color:#f7c1c1}
  .abtn.d:hover{background:#fce4ec}
  .search-row{display:flex;gap:8px;margin-bottom:12px}
  .sinput{flex:1;padding:7px 11px;border:0.5px solid #e5e7eb;border-radius:8px;font-size:12px;background:#f9fafb;color:#111;outline:none}
  .sinput:focus{border-color:#c0405f;background:white}
  .fsel{padding:7px 10px;border:0.5px solid #e5e7eb;border-radius:8px;font-size:12px;background:#f9fafb;color:#6b7280;outline:none}
  .stat-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px;margin-bottom:14px}
  .scard{background:#f9fafb;border-radius:10px;padding:13px 14px;border:0.5px solid #e5e7eb}
  .sval{font-size:20px;font-weight:600;color:#111}
  .slbl{font-size:10px;color:#9ca3af;margin-top:2px}
  .sdelta{font-size:10px;margin-top:3px}
  .du{color:#2e7d32}.dd{color:#c62828}
  .tab-row{display:flex;gap:2px;margin-bottom:12px;flex-wrap:wrap}
  .tab{padding:5px 12px;border-radius:8px;font-size:12px;cursor:pointer;color:#6b7280;border:none;background:transparent;transition:all .15s}
  .tab:hover{background:#f3f4f6}
  .tab.on{background:#fdf0f3;color:#b83458;font-weight:500}
  .mini-img{width:36px;height:36px;border-radius:6px;background:#fdf0f3;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;overflow:hidden}
  .mini-img img{width:100%;height:100%;object-fit:cover;border-radius:6px}
  .prod-row{display:flex;align-items:center;gap:8px}
  .msg-ok{padding:10px 14px;border-radius:8px;background:#e8f5e9;color:#2e7d32;font-size:13px;margin-bottom:12px;display:flex;align-items:center;gap:8px}
  .msg-err{padding:10px 14px;border-radius:8px;background:#fce4ec;color:#c62828;font-size:13px;margin-bottom:12px}
  .loading{padding:20px;text-align:center;color:#9ca3af;font-size:13px}

  /* ── Vista grid productos ── */
  .grid-prods{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:10px}
  .prod-card{background:white;border:0.5px solid #e5e7eb;border-radius:10px;overflow:hidden;cursor:pointer;transition:box-shadow .2s}
  .prod-card:hover{box-shadow:0 4px 16px rgba(0,0,0,.08)}
  .prod-card-img{width:100%;height:120px;object-fit:cover;background:#fdf0f3;display:flex;align-items:center;justify-content:center;font-size:32px}
  .prod-card-img img{width:100%;height:100%;object-fit:cover}
  .prod-card-body{padding:10px}
  .prod-card-name{font-size:12px;font-weight:500;color:#111;margin-bottom:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .prod-card-price{font-size:11px;color:#b83458;font-weight:600}
  .prod-card-stock{font-size:10px;color:#9ca3af;margin-top:2px}

  /* ── Modal ── */
  .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1000;backdrop-filter:blur(2px);animation:fadeIn .2s}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  .modal-box{background:white;border-radius:16px;width:640px;max-width:95vw;max-height:88vh;overflow-y:auto;box-shadow:0 24px 64px rgba(0,0,0,.18);animation:slideUp .2s}
  @keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
  .modal-header{padding:18px 20px 14px;border-bottom:0.5px solid #e5e7eb;display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;background:white;z-index:1;border-radius:16px 16px 0 0}
  .modal-title{font-size:15px;font-weight:600;color:#111}
  .modal-close{width:28px;height:28px;border-radius:8px;border:0.5px solid #e5e7eb;background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:14px;color:#6b7280;transition:all .15s}
  .modal-close:hover{background:#f3f4f6;color:#111}
  .modal-body{padding:18px 20px}
  .modal-footer{padding:14px 20px;border-top:0.5px solid #e5e7eb;display:flex;gap:8px;justify-content:flex-end;position:sticky;bottom:0;background:white;border-radius:0 0 16px 16px}

  /* ── Timeline ── */
  .timeline{position:relative;padding-left:20px}
  .timeline::before{content:'';position:absolute;left:6px;top:4px;bottom:4px;width:1.5px;background:#e5e7eb}
  .tl-item{position:relative;margin-bottom:14px}
  .tl-dot{position:absolute;left:-17px;top:3px;width:10px;height:10px;border-radius:50%;background:#c0405f;border:2px solid white;box-shadow:0 0 0 1.5px #c0405f}
  .tl-dot.done{background:#2e7d32;box-shadow:0 0 0 1.5px #2e7d32}
  .tl-dot.gray{background:#9ca3af;box-shadow:0 0 0 1.5px #9ca3af}
  .tl-label{font-size:12px;font-weight:500;color:#111}
  .tl-date{font-size:10px;color:#9ca3af;margin-top:1px}

  /* ── Toast notificación nuevo pedido ── */
  .toast{position:fixed;bottom:24px;right:24px;background:#111;color:white;padding:12px 16px;border-radius:12px;font-size:13px;z-index:2000;display:flex;align-items:center;gap:10px;box-shadow:0 8px 24px rgba(0,0,0,.25);animation:toastIn .3s}
  @keyframes toastIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
  .toast-icon{font-size:18px}
  .toast-close{margin-left:8px;background:transparent;border:none;color:#9ca3af;cursor:pointer;font-size:14px;padding:0}

  /* ── Export btn ── */
  .btn-export{padding:6px 12px;background:#f9fafb;color:#6b7280;border:0.5px solid #e5e7eb;border-radius:8px;font-size:12px;cursor:pointer;display:flex;align-items:center;gap:5px;transition:all .15s}
  .btn-export:hover{background:#f3f4f6;color:#111}

  /* ── Estado selector en modal ── */
  .estado-selector{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}
  .estado-btn{padding:5px 12px;border-radius:20px;border:1.5px solid #e5e7eb;font-size:11px;font-weight:500;cursor:pointer;background:transparent;color:#6b7280;transition:all .15s}
  .estado-btn:hover{border-color:#c0405f;color:#c0405f}
  .estado-btn.active{background:#c0405f;color:white;border-color:#c0405f}

  /* Print */
  @media print{
    body > *:not(#print-area){display:none}
    #print-area{display:block!important;font-family:Arial,sans-serif;padding:20px}
  }
`;

const fmt = (n) => Number(n).toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 });
const estadoBadge = (e) => {
  const map = { pendiente: 'b-warn', confirmado: 'b-blue', enviado: 'b-purple', entregado: 'b-ok', cancelado: 'b-err' };
  return map[e] || 'b-gray';
};
const pagoBadge = (e) => {
  const map = { pendiente: 'b-warn', confirmado: 'b-ok', fallido: 'b-err' };
  return map[e] || 'b-gray';
};
const ESTADOS = ['pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado'];

export default function Admin() {
  const navigate = useNavigate();

  const [seccion, setSeccion] = useState('dashboard');
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [vistaProds, setVistaProds] = useState('tabla'); // 'tabla' | 'grid'

  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loadingProds, setLoadingProds] = useState(false);
  const [loadingPeds, setLoadingPeds] = useState(false);
  const [loadingClients, setLoadingClients] = useState(false);

  // Modal
  const [detallePedido, setDetallePedido] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [timeline, setTimeline] = useState([]);
  const [loadingModal, setLoadingModal] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);
  const pedidosRef = useRef([]);
  const pollingRef = useRef(null);

  // Formulario producto
  const [form, setForm] = useState({ nombre: '', precio: '', stock: '', descripcion: '', categoria_id: '', imagen: null });
  const [editando, setEditando] = useState(null);

  // Filtros
  const [filtroPed, setFiltroPed] = useState('todos');
  const [busquedaProd, setBusquedaProd] = useState('');
  const [busquedaPed, setBusquedaPed] = useState('');
  const [busquedaCliente, setBusquedaCliente] = useState('');
  const [catFiltro, setCatFiltro] = useState('');

  // Categoría
  const [formCat, setFormCat] = useState({ nombre: '', descripcion: '' });
  const [editandoCat, setEditandoCat] = useState(null);

  /* ── Carga de datos ── */
  const cargarProductos = useCallback(async () => {
    setLoadingProds(true);
    try { const r = await api.get('/productos'); setProductos(r.data.data ?? r.data); }
    catch (e) { console.error(e); } finally { setLoadingProds(false); }
  }, []);

  const cargarCategorias = useCallback(async () => {
    try { const r = await api.get('/categorias'); setCategorias(r.data.data ?? r.data); }
    catch (e) { console.error(e); }
  }, []);

  const cargarPedidos = useCallback(async (silent = false) => {
    if (!silent) setLoadingPeds(true);
    try {
      const r = await api.get('/pedidos');
      const nuevos = r.data.data ?? r.data;

      // Detectar pedidos nuevos para notificación (polling)
      if (pedidosRef.current.length > 0 && nuevos.length > pedidosRef.current.length) {
        const diff = nuevos.length - pedidosRef.current.length;
        showToast(`🛍️ ${diff} pedido${diff > 1 ? 's' : ''} nuevo${diff > 1 ? 's' : ''} recibido${diff > 1 ? 's' : ''}`);
      }
      pedidosRef.current = nuevos;
      setPedidos(nuevos);
    } catch (e) { console.error(e); }
    finally { if (!silent) setLoadingPeds(false); }
  }, []);

  const cargarClientes = useCallback(async () => {
    setLoadingClients(true);
    try { const r = await api.get('/clientes'); setClientes(r.data.data ?? r.data); }
    catch (e) { console.error(e); } finally { setLoadingClients(false); }
  }, []);

  useEffect(() => {
    cargarProductos();
    cargarCategorias();
    cargarPedidos();
    cargarClientes();
  }, [cargarProductos, cargarCategorias, cargarPedidos, cargarClientes]);

  // Polling cada 30s para detectar pedidos nuevos
  useEffect(() => {
    pollingRef.current = setInterval(() => cargarPedidos(true), 30000);
    return () => clearInterval(pollingRef.current);
  }, [cargarPedidos]);

  /* ── Toast ── */
  const showToast = (texto) => {
    setToast(texto);
    setTimeout(() => setToast(null), 5000);
  };

  /* ── Modal detalle ── */
  const verDetalle = async (id) => {
    setLoadingModal(true);
    setShowModal(true);
    setDetallePedido(null);
    setTimeline([]);
    try {
      const [resDet, resHist] = await Promise.all([
        api.get(`/pedidos/${id}`),
        api.get(`/pedidos/${id}/seguimiento`).catch(() => ({ data: { data: [] } }))
      ]);
      setDetallePedido(resDet.data.data);
      setTimeline(resHist.data.data ?? []);
    } catch (err) {
      console.error(err);
      showMsg('❌ Error al cargar el detalle', 'err');
      setShowModal(false);
    } finally {
      setLoadingModal(false);
    }
  };

  const cerrarModal = () => {
    setShowModal(false);
    setDetallePedido(null);
    setTimeline([]);
  };

  /* ── Cambiar estado desde modal ── */
  const cambiarEstadoDesdeModal = async (nuevoEstado) => {
    if (!detallePedido) return;
    try {
      await api.put(`/pedidos/${detallePedido.pedido.id}`, { estado: nuevoEstado });
      // Refrescar detalle y pedidos
      const [resDet, resHist] = await Promise.all([
        api.get(`/pedidos/${detallePedido.pedido.id}`),
        api.get(`/pedidos/${detallePedido.pedido.id}/seguimiento`).catch(() => ({ data: { data: [] } }))
      ]);
      setDetallePedido(resDet.data.data);
      setTimeline(resHist.data.data ?? []);
      cargarPedidos(true);
      showMsg('✅ Estado actualizado');
    } catch (err) {
      showMsg('❌ ' + (err.response?.data?.mensaje || err.message), 'err');
    }
  };

  /* ── WhatsApp ── */
  const abrirWhatsApp = (pedido) => {
    const tel = pedido.telefono?.replace(/\D/g, '');
    const msg = encodeURIComponent(`Hola ${pedido.nombre_completo}, tu pedido #${pedido.id} está en estado: *${pedido.estado}*. ¡Gracias por tu compra! 💎`);
    window.open(`https://wa.me/57${tel}?text=${msg}`, '_blank');
  };

  /* ── Imprimir factura ── */
  const imprimirFactura = () => {
    if (!detallePedido) return;
    const { pedido, productos: prods } = detallePedido;
    const win = window.open('', '_blank');
    win.document.write(`
      <html><head><title>Factura #${pedido.id}</title>
      <style>
        body{font-family:Arial,sans-serif;padding:30px;color:#111;max-width:500px;margin:0 auto}
        h2{color:#c0405f;margin-bottom:4px}
        .sub{color:#999;font-size:12px;margin-bottom:20px}
        .info p{margin:4px 0;font-size:13px}
        table{width:100%;border-collapse:collapse;margin-top:16px}
        th{text-align:left;font-size:11px;color:#999;border-bottom:1px solid #eee;padding:6px 0}
        td{padding:7px 0;font-size:13px;border-bottom:1px solid #f5f5f5}
        .total{text-align:right;font-size:15px;font-weight:bold;margin-top:12px;color:#c0405f}
        .footer{margin-top:24px;font-size:11px;color:#999;text-align:center}
      </style></head><body>
      <h2>✨ Bisutería</h2>
      <div class="sub">Factura Pedido #${pedido.id} · ${new Date().toLocaleDateString('es-CO')}</div>
      <div class="info">
        <p><strong>Cliente:</strong> ${pedido.nombre_completo}</p>
        <p><strong>Cédula:</strong> ${pedido.cedula || '—'}</p>
        <p><strong>Tel:</strong> ${pedido.telefono}</p>
        <p><strong>Dirección:</strong> ${pedido.direccion}</p>
        <p><strong>Ciudad:</strong> ${pedido.ciudad || '—'}</p>
      </div>
      <table>
        <thead><tr><th>Producto</th><th>Cant.</th><th>Precio</th><th style="text-align:right">Subtotal</th></tr></thead>
        <tbody>
          ${prods.map(p => `<tr>
            <td>${p.nombre}</td>
            <td>${p.cantidad}</td>
            <td>${fmt(p.precio_unitario)}</td>
            <td style="text-align:right">${fmt(p.subtotal)}</td>
          </tr>`).join('')}
        </tbody>
      </table>
      <div class="total">Total: ${fmt(pedido.total)}</div>
      <div class="footer">¡Gracias por tu compra! · Estado: ${pedido.estado}</div>
      </body></html>
    `);
    win.document.close();
    win.print();
  };

  /* ── Exportar CSV ── */
  const exportarCSV = () => {
    const rows = [
      ['#', 'Cliente', 'Teléfono', 'Total', 'Estado', 'Pago', 'Fecha'],
      ...pedsFiltrados.map(p => [
        p.id, p.nombre_cliente || '—', p.telefono || '—',
        p.total, p.estado, p.estado_pago || '—',
        p.creado_at ? new Date(p.creado_at).toLocaleDateString('es-CO') : '—'
      ])
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `pedidos_${new Date().toISOString().slice(0,10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  /* ── Navegación ── */
  const ir = (id) => { setSeccion(id); setMensaje({ texto: '', tipo: '' }); };
  const showMsg = (texto, tipo = 'ok') => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje({ texto: '', tipo: '' }), 3500);
  };

  /* ── Producto ── */
  const resetForm = () => {
    setForm({ nombre: '', precio: '', stock: '', descripcion: '', categoria_id: '', imagen: null });
    setEditando(null);
  };
  const iniciarEdicion = (p) => {
    setEditando(p.id);
    setForm({ nombre: p.nombre, precio: p.precio, stock: p.stock, descripcion: p.descripcion || '', categoria_id: p.categoria_id || '', imagen: null });
    setSeccion('nuevo');
    setMensaje({ texto: '', tipo: '' });
  };
  const cancelarEdicion = () => { resetForm(); ir('productos'); };
  const guardarProducto = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      ['nombre', 'precio', 'descripcion', 'categoria_id'].forEach(k => data.append(k, form[k]));
      data.append('stock', form.stock || 0);
      if (form.imagen) data.append('imagen', form.imagen);
      const headers = { 'Content-Type': 'multipart/form-data' };
      if (editando) {
        await api.put(`/productos/${editando}`, data, { headers });
        showMsg('✅ Producto actualizado correctamente');
      } else {
        await api.post('/productos', data, { headers });
        showMsg('✅ Producto creado correctamente');
      }
      resetForm(); cargarProductos(); ir('productos');
    } catch (err) { showMsg('❌ ' + (err.response?.data?.mensaje || err.message), 'err'); }
  };
  const eliminarProducto = async (id) => {
    if (!window.confirm('¿Eliminar este producto?')) return;
    try {
      await api.delete(`/productos/${id}`);
      if (editando === id) resetForm();
      cargarProductos(); showMsg('✅ Producto eliminado');
    } catch (err) { showMsg('❌ ' + (err.response?.data?.mensaje || err.message), 'err'); }
  };

  /* ── Categoría ── */
  const guardarCategoria = async (e) => {
    e.preventDefault();
    try {
      if (editandoCat) {
        await api.put(`/categorias/${editandoCat}`, formCat);
        showMsg('✅ Categoría actualizada'); setEditandoCat(null);
      } else {
        await api.post('/categorias', formCat); showMsg('✅ Categoría creada');
      }
      setFormCat({ nombre: '', descripcion: '' }); cargarCategorias();
    } catch (err) { showMsg('❌ ' + (err.response?.data?.mensaje || err.message), 'err'); }
  };
  const eliminarCategoria = async (id) => {
    if (!window.confirm('¿Eliminar esta categoría?')) return;
    try { await api.delete(`/categorias/${id}`); cargarCategorias(); showMsg('✅ Categoría eliminada'); }
    catch (err) { showMsg('❌ ' + (err.response?.data?.mensaje || err.message), 'err'); }
  };

  /* ── Pedidos ── */
  const cambiarEstadoPedido = async (id, nuevoEstado) => {
    try {
      await api.put(`/pedidos/${id}`, { estado: nuevoEstado });
      cargarPedidos(true); showMsg('✅ Pedido actualizado');
    } catch (err) { showMsg('❌ ' + (err.response?.data?.mensaje || err.message), 'err'); }
  };

  /* ── Logout ── */
  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    localStorage.removeItem('token');
    navigate('/admin-login');
  };

  /* ── Métricas ── */
  const totalVentas = pedidos.filter(p => p.estado === 'entregado').reduce((s, p) => s + Number(p.total), 0);
  const prodActivos = productos.filter(p => p.activo !== 0).length;
  const stockBajo = productos.filter(p => Number(p.stock) <= 3).length;
  const pedsPendientes = pedidos.filter(p => p.estado === 'pendiente').length;

  /* ── Filtros ── */
  const prodsFiltrados = productos.filter(p => {
    const matchNombre = p.nombre.toLowerCase().includes(busquedaProd.toLowerCase());
    const matchCat = catFiltro ? String(p.categoria_id) === String(catFiltro) : true;
    return matchNombre && matchCat;
  });

  const pedsFiltrados = pedidos
    .filter(p => filtroPed === 'todos' || p.estado === filtroPed)
    .filter(p => {
      if (!busquedaPed) return true;
      const q = busquedaPed.toLowerCase();
      return String(p.id).includes(q) ||
        (p.nombre_cliente || '').toLowerCase().includes(q) ||
        (p.telefono || '').includes(q);
    });

  const clientesFiltrados = clientes.filter(c =>
    c.nombre_completo.toLowerCase().includes(busquedaCliente.toLowerCase()) ||
    c.telefono.includes(busquedaCliente) ||
    c.correo.toLowerCase().includes(busquedaCliente.toLowerCase())
  );

  const ventasPorCat = categorias.map(cat => {
    const prods = productos.filter(p => p.categoria_id === cat.id);
    return { nombre: cat.nombre, cantidad: prods.length };
  }).filter(c => c.cantidad > 0).sort((a, b) => b.cantidad - a.cantidad).slice(0, 4);
  const totalProds = ventasPorCat.reduce((s, c) => s + c.cantidad, 0) || 1;

  const titulos = {
    dashboard: 'Dashboard', productos: 'Productos',
    nuevo: editando ? 'Editar producto' : 'Nuevo producto',
    categorias: 'Categorías', pedidos: 'Pedidos', clientes: 'Clientes'
  };

  const pedidosPorEstado = {
    pendiente: pedidos.filter(p => p.estado === 'pendiente').length,
    confirmado: pedidos.filter(p => p.estado === 'confirmado').length,
    enviado: pedidos.filter(p => p.estado === 'enviado').length,
    entregado: pedidos.filter(p => p.estado === 'entregado').length,
  };

  /* ─────── RENDER ─────── */
  return (
    <div style={{ minHeight: '100vh', background: '#f8f8f8' }}>
      <style>{CSS}</style>

      {/* Barra superior */}
      <div style={{ background: 'white', borderBottom: '1px solid #eee', padding: '10px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#c0405f,#e8547a)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>✨</div>
          <span style={{ fontWeight: 600, fontSize: 14 }}>Bisutería Admin</span>
          <span style={{ fontSize: 10, padding: '2px 8px', background: '#fdf0f3', color: '#b83458', borderRadius: 8, fontWeight: 500 }}>ADMIN</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 11, color: '#9ca3af' }}>Auto-actualización cada 30s</span>
          <button onClick={handleLogout} style={{ padding: '6px 14px', background: 'transparent', border: '1px solid #ddd', borderRadius: 8, fontSize: 12, cursor: 'pointer', color: '#666' }}>
            Cerrar sesión
          </button>
        </div>
      </div>

      <div style={{ padding: 20 }}>
        <div className="shell">

          {/* ── SIDEBAR ── */}
          <div className="nav">
            <div className="nav-logo">
              <div className="logo-name">Panel de gestión</div>
              <div className="logo-tag">tienda_bisuteria</div>
            </div>
            <div className="nav-sec">principal</div>
            <NavItem id="dashboard" label="Dashboard" seccion={seccion} onClick={ir}>
              <svg viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.2"/></svg>
            </NavItem>
            <div className="nav-sec">catálogo</div>
            <NavItem id="productos" label="Productos" seccion={seccion} onClick={ir}>
              <svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.2"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2"/></svg>
            </NavItem>
            <NavItem id="nuevo" label="Nuevo producto" seccion={seccion} onClick={() => { resetForm(); ir('nuevo'); }}>
              <svg viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
            </NavItem>
            <NavItem id="categorias" label="Categorías" seccion={seccion} onClick={ir}>
              <svg viewBox="0 0 16 16" fill="none"><path d="M3 4h10M3 8h7M3 12h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
            </NavItem>
            <div className="nav-sec">ventas</div>
            <NavItem id="pedidos" label="Pedidos" seccion={seccion} onClick={ir} badge={pedsPendientes > 0 ? pedsPendientes : null} badgePulse={pedsPendientes > 0}>
              <svg viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M5 7h6M5 10h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
            </NavItem>
            <div className="nav-sec">clientes</div>
            <NavItem id="clientes" label="Clientes" seccion={seccion} onClick={ir}>
              <svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.2"/><path d="M2 14c0-3 2.7-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
            </NavItem>
            <div className="nav-foot">
              Sesión: Admin · <span style={{ color: '#c0405f', cursor: 'pointer' }} onClick={handleLogout}>Salir</span>
            </div>
          </div>

          {/* ── MAIN ── */}
          <div className="main">
            <div className="topbar">
              <div className="tbar-left">
                <span className="tbar-title">{titulos[seccion]}</span>
                {seccion === 'nuevo' && editando && <span className="mode-badge">Modo edición</span>}
              </div>
              <div className="tbar-right">
                {seccion === 'productos' && (
                  <div style={{ display: 'flex', gap: 4, background: '#f3f4f6', borderRadius: 8, padding: 3 }}>
                    <button className={`abtn${vistaProds === 'tabla' ? ' active' : ''}`} style={{ background: vistaProds === 'tabla' ? 'white' : 'transparent', boxShadow: vistaProds === 'tabla' ? '0 1px 3px rgba(0,0,0,.1)' : 'none' }} onClick={() => setVistaProds('tabla')}>≡ Tabla</button>
                    <button className={`abtn${vistaProds === 'grid' ? ' active' : ''}`} style={{ background: vistaProds === 'grid' ? 'white' : 'transparent', boxShadow: vistaProds === 'grid' ? '0 1px 3px rgba(0,0,0,.1)' : 'none' }} onClick={() => setVistaProds('grid')}>⊞ Grid</button>
                  </div>
                )}
                {seccion === 'pedidos' && (
                  <button className="btn-export" onClick={exportarCSV}>
                    ↓ Exportar CSV
                  </button>
                )}
                {seccion !== 'nuevo' && (
                  <button className="btn-p" onClick={() => { resetForm(); ir('nuevo'); }}>+ Nuevo producto</button>
                )}
                {seccion === 'nuevo' && editando && (
                  <button className="btn-s" onClick={cancelarEdicion}>Cancelar edición</button>
                )}
              </div>
            </div>

            <div className="body">
              {mensaje.texto && (
                <div className={mensaje.tipo === 'err' ? 'msg-err' : 'msg-ok'}>{mensaje.texto}</div>
              )}

              {/* ══ DASHBOARD ══ */}
              <div className={`panel${seccion === 'dashboard' ? ' on' : ''}`}>
                <div className="stat-grid">
                  <div className="scard">
                    <div className="sval">{fmt(totalVentas)}</div>
                    <div className="slbl">Ventas entregadas</div>
                    <div className="sdelta du">↑ pedidos completados</div>
                  </div>
                  <div className="scard">
                    <div className="sval">{prodActivos}</div>
                    <div className="slbl">Productos activos</div>
                    <div className="sdelta du">de {productos.length} en total</div>
                  </div>
                  <div className="scard">
                    <div className="sval" style={{ color: stockBajo > 0 ? '#e65100' : '#111' }}>{stockBajo}</div>
                    <div className="slbl">Stock bajo o agotado</div>
                    <div className="sdelta dd">{stockBajo > 0 ? '↓ requieren atención' : '✓ todo en orden'}</div>
                  </div>
                  <div className="scard">
                    <div className="sval">{pedsPendientes}</div>
                    <div className="slbl">Pedidos pendientes</div>
                    <div className="sdelta" style={{ color: '#b83458' }}>{pedidos.length} pedidos en total</div>
                  </div>
                </div>

                <div className="two-col" style={{ marginBottom: 12 }}>
                  <div className="card">
                    <div className="card-title">Productos por categoría</div>
                    {ventasPorCat.length === 0 ? <div className="loading">Sin datos</div> :
                      ventasPorCat.map(({ nombre, cantidad }) => {
                        const pct = Math.round((cantidad / totalProds) * 100);
                        return (
                          <div key={nombre} style={{ marginBottom: 9 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#6b7280', marginBottom: 4 }}>
                              <span>{nombre}</span><span>{cantidad} · {pct}%</span>
                            </div>
                            <div style={{ height: 5, background: '#f3f4f6', borderRadius: 3 }}>
                              <div style={{ width: `${pct}%`, height: 5, background: 'linear-gradient(90deg,#c0405f,#e8547a)', borderRadius: 3, transition: 'width .5s' }}></div>
                            </div>
                          </div>
                        );
                      })
                    }
                  </div>
                  <div className="card">
                    <div className="card-title">Pedidos recientes</div>
                    {pedidos.length === 0 ? <div className="loading">Sin pedidos</div> :
                      pedidos.slice(0, 5).map(p => (
                        <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '0.5px solid #f0f0f0', cursor: 'pointer' }} onClick={() => { ir('pedidos'); }}>
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 500 }}>#{p.id} — {p.nombre_cliente || 'Cliente'}</div>
                            <div style={{ fontSize: 10, color: '#9ca3af' }}>{fmt(p.total)}</div>
                          </div>
                          <span className={`badge ${estadoBadge(p.estado)}`}>{p.estado}</span>
                        </div>
                      ))
                    }
                  </div>
                </div>

                <div className="stat-grid">
                  {Object.entries(pedidosPorEstado).map(([k, v]) => (
                    <div key={k} className="scard" style={{ cursor: 'pointer' }} onClick={() => { setFiltroPed(k); ir('pedidos'); }}>
                      <div className="sval">{v}</div>
                      <div className="slbl">{k}</div>
                      <div className="sdelta" style={{ color: '#9ca3af' }}>ver pedidos →</div>
                    </div>
                  ))}
                </div>

                <div className="card">
                  <div className="card-title">Productos con stock bajo (≤ 3 unidades)</div>
                  {productos.filter(p => Number(p.stock) <= 3).length === 0
                    ? <div className="loading">✓ Todos los productos tienen stock suficiente</div>
                    : (
                      <table>
                        <thead><tr><th>PRODUCTO</th><th>CATEGORÍA</th><th>STOCK</th><th>ESTADO</th><th></th></tr></thead>
                        <tbody>
                          {productos.filter(p => Number(p.stock) <= 3).map(p => {
                            const cat = categorias.find(c => c.id === p.categoria_id);
                            return (
                              <tr key={p.id}>
                                <td><div className="prod-row"><div className="mini-img">{p.imagen_url ? <img src={p.imagen_url} alt={p.nombre} /> : '💎'}</div>{p.nombre}</div></td>
                                <td>{cat?.nombre || '—'}</td>
                                <td><strong style={{ color: Number(p.stock) === 0 ? '#c62828' : '#e65100' }}>{p.stock}</strong></td>
                                <td><span className={`badge ${Number(p.stock) === 0 ? 'b-err' : 'b-warn'}`}>{Number(p.stock) === 0 ? 'Agotado' : 'Bajo'}</span></td>
                                <td><button className="abtn" onClick={() => iniciarEdicion(p)}>Reponer</button></td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                </div>
              </div>

              {/* ══ PRODUCTOS ══ */}
              <div className={`panel${seccion === 'productos' ? ' on' : ''}`}>
                <div className="search-row">
                  <input className="sinput" type="text" placeholder="🔍 Buscar por nombre..." value={busquedaProd} onChange={e => setBusquedaProd(e.target.value)} />
                  <select className="fsel" value={catFiltro} onChange={e => setCatFiltro(e.target.value)}>
                    <option value="">Todas las categorías</option>
                    {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                  </select>
                </div>

                {/* Vista tabla */}
                {vistaProds === 'tabla' && (
                  <div className="card" style={{ padding: 0 }}>
                    {loadingProds ? <div className="loading">Cargando productos…</div> : (
                      <table>
                        <thead>
                          <tr>
                            <th style={{ paddingLeft: 14 }}>PRODUCTO</th>
                            <th>CATEGORÍA</th><th>PRECIO</th><th>STOCK</th><th>ESTADO</th>
                            <th style={{ paddingRight: 14 }}>ACCIONES</th>
                          </tr>
                        </thead>
                        <tbody>
                          {prodsFiltrados.length === 0
                            ? <tr><td colSpan={6} style={{ textAlign: 'center', color: '#9ca3af', padding: 20 }}>No se encontraron productos</td></tr>
                            : prodsFiltrados.map(p => {
                              const cat = categorias.find(c => c.id === p.categoria_id);
                              const sn = Number(p.stock);
                              const sCls = sn === 0 ? 'b-err' : sn <= 3 ? 'b-warn' : 'b-ok';
                              const sLbl = sn === 0 ? 'Agotado' : sn <= 3 ? 'Stock bajo' : 'Activo';
                              return (
                                <tr key={p.id} style={{ background: editando === p.id ? '#fff8f0' : undefined }}>
                                  <td style={{ paddingLeft: 14 }}>
                                    <div className="prod-row">
                                      <div className="mini-img">{p.imagen_url ? <img src={p.imagen_url} alt={p.nombre} /> : '💎'}</div>
                                      <div>
                                        <div style={{ fontSize: 12, fontWeight: 500 }}>{p.nombre}</div>
                                        <div style={{ fontSize: 10, color: '#9ca3af' }}>ID: {p.id}</div>
                                      </div>
                                    </div>
                                  </td>
                                  <td>{cat?.nombre || '—'}</td>
                                  <td>{fmt(p.precio)}</td>
                                  <td>{p.stock}</td>
                                  <td><span className={`badge ${sCls}`}>{sLbl}</span></td>
                                  <td style={{ paddingRight: 14 }}>
                                    <div className="arow">
                                      <button className="abtn" onClick={() => iniciarEdicion(p)}>Editar</button>
                                      <button className="abtn d" onClick={() => eliminarProducto(p.id)}>Eliminar</button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}

                {/* Vista grid */}
                {vistaProds === 'grid' && (
                  loadingProds ? <div className="loading">Cargando productos…</div> : (
                    <div className="grid-prods">
                      {prodsFiltrados.map(p => {
                        const sn = Number(p.stock);
                        const sCls = sn === 0 ? 'b-err' : sn <= 3 ? 'b-warn' : 'b-ok';
                        const sLbl = sn === 0 ? 'Agotado' : sn <= 3 ? `Stock: ${sn}` : `Stock: ${sn}`;
                        return (
                          <div key={p.id} className="prod-card">
                            <div className="prod-card-img">
                              {p.imagen_url ? <img src={p.imagen_url} alt={p.nombre} /> : '💎'}
                            </div>
                            <div className="prod-card-body">
                              <div className="prod-card-name" title={p.nombre}>{p.nombre}</div>
                              <div className="prod-card-price">{fmt(p.precio)}</div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                                <span className={`badge ${sCls}`}>{sLbl}</span>
                                <div className="arow">
                                  <button className="abtn" style={{ padding: '2px 7px', fontSize: 10 }} onClick={() => iniciarEdicion(p)}>✏️</button>
                                  <button className="abtn d" style={{ padding: '2px 7px', fontSize: 10 }} onClick={() => eliminarProducto(p.id)}>🗑</button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )
                )}
              </div>

              {/* ══ NUEVO / EDITAR PRODUCTO ══ */}
              <div className={`panel${seccion === 'nuevo' ? ' on' : ''}`}>
                <form onSubmit={guardarProducto}>
                  <div className="two-col" style={{ alignItems: 'start' }}>
                    <div>
                      <div className="card">
                        <div className="card-title">Información básica</div>
                        <div className="field">
                          <div className="flabel">NOMBRE DEL PRODUCTO</div>
                          <input className="finput" placeholder="Ej: Collar luna miyuki" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} required />
                        </div>
                        <div className="two-col">
                          <div className="field">
                            <div className="flabel">PRECIO (COP)</div>
                            <input className="finput" type="number" placeholder="45000" value={form.precio} onChange={e => setForm({ ...form, precio: e.target.value })} required />
                          </div>
                          <div className="field">
                            <div className="flabel">STOCK</div>
                            <input className="finput" type="number" placeholder="10" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
                          </div>
                        </div>
                        <div className="field">
                          <div className="flabel">DESCRIPCIÓN</div>
                          <textarea className="ftextarea" placeholder="Describe el producto…" value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} />
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="card">
                        <div className="card-title">Clasificación</div>
                        <div className="field">
                          <div className="flabel">CATEGORÍA</div>
                          <select className="fselect" value={form.categoria_id} onChange={e => setForm({ ...form, categoria_id: e.target.value })} required>
                            <option value="">Seleccionar categoría…</option>
                            {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="card">
                        <div className="card-title">Imagen del producto</div>
                        <div className="upload-zone" onClick={() => document.getElementById('img-input').click()}>
                          <svg style={{ width: 28, height: 28, margin: '0 auto 6px', opacity: .4, display: 'block' }} viewBox="0 0 28 28" fill="none"><rect x="2" y="6" width="24" height="18" rx="3" stroke="currentColor" strokeWidth="1.5"/><path d="M14 22V10M9 15l5-5 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          <div>{form.imagen ? form.imagen.name : 'Arrastra la imagen aquí o haz clic para subir'}</div>
                          <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 3 }}>JPG, PNG · máx 5MB</div>
                        </div>
                        <input id="img-input" type="file" accept="image/*" style={{ display: 'none' }} onChange={e => setForm({ ...form, imagen: e.target.files[0] })} />
                      </div>
                      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                        <button type="submit" className="btn-p" style={{ flex: 1, padding: 9 }}>{editando ? 'Guardar cambios' : 'Crear producto'}</button>
                        {editando && <button type="button" className="btn-s" style={{ padding: '9px 14px' }} onClick={cancelarEdicion}>Cancelar</button>}
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              {/* ══ CATEGORÍAS ══ */}
              <div className={`panel${seccion === 'categorias' ? ' on' : ''}`}>
                <div className="card">
                  <div className="card-title">{editandoCat ? '✏️ Editar categoría' : '+ Nueva categoría'}</div>
                  <form onSubmit={guardarCategoria} style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
                    <div className="field" style={{ flex: 1, marginBottom: 0 }}>
                      <div className="flabel">NOMBRE</div>
                      <input className="finput" placeholder="Ej: Pulseras" value={formCat.nombre} onChange={e => setFormCat({ ...formCat, nombre: e.target.value })} required />
                    </div>
                    <div className="field" style={{ flex: 2, marginBottom: 0 }}>
                      <div className="flabel">DESCRIPCIÓN</div>
                      <input className="finput" placeholder="Descripción opcional" value={formCat.descripcion} onChange={e => setFormCat({ ...formCat, descripcion: e.target.value })} />
                    </div>
                    <button type="submit" className="btn-p" style={{ whiteSpace: 'nowrap' }}>{editandoCat ? 'Guardar' : 'Crear'}</button>
                    {editandoCat && <button type="button" className="btn-s" onClick={() => { setEditandoCat(null); setFormCat({ nombre: '', descripcion: '' }); }}>Cancelar</button>}
                  </form>
                </div>
                <div className="card" style={{ padding: 0 }}>
                  <table>
                    <thead><tr><th style={{ paddingLeft: 14 }}>NOMBRE</th><th>DESCRIPCIÓN</th><th>PRODUCTOS</th><th style={{ paddingRight: 14 }}>ACCIONES</th></tr></thead>
                    <tbody>
                      {categorias.length === 0
                        ? <tr><td colSpan={4} style={{ textAlign: 'center', color: '#9ca3af', padding: 20 }}>Sin categorías</td></tr>
                        : categorias.map(c => {
                          const cnt = productos.filter(p => p.categoria_id === c.id).length;
                          return (
                            <tr key={c.id}>
                              <td style={{ paddingLeft: 14 }}><strong style={{ fontSize: 12 }}>{c.nombre}</strong></td>
                              <td style={{ fontSize: 11, color: '#6b7280' }}>{c.descripcion || '—'}</td>
                              <td>{cnt}</td>
                              <td style={{ paddingRight: 14 }}>
                                <div className="arow">
                                  <button className="abtn" onClick={() => { setEditandoCat(c.id); setFormCat({ nombre: c.nombre, descripcion: c.descripcion || '' }); }}>Editar</button>
                                  <button className="abtn d" onClick={() => eliminarCategoria(c.id)}>Eliminar</button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ══ PEDIDOS ══ */}
              <div className={`panel${seccion === 'pedidos' ? ' on' : ''}`}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' }}>
                  <input className="sinput" style={{ flex: 1 }} type="text" placeholder="🔍 Buscar por #, cliente o teléfono..." value={busquedaPed} onChange={e => setBusquedaPed(e.target.value)} />
                  <span style={{ fontSize: 11, color: '#9ca3af', whiteSpace: 'nowrap' }}>{pedsFiltrados.length} resultado{pedsFiltrados.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="tab-row">
                  {['todos', 'pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado'].map(e => {
                    const cnt = e === 'todos' ? pedidos.length : pedidos.filter(p => p.estado === e).length;
                    return (
                      <button key={e} className={`tab${filtroPed === e ? ' on' : ''}`} onClick={() => setFiltroPed(e)}>
                        {e.charAt(0).toUpperCase() + e.slice(1)} ({cnt})
                      </button>
                    );
                  })}
                </div>
                <div className="card" style={{ padding: 0 }}>
                  {loadingPeds ? <div className="loading">Cargando pedidos…</div> : (
                    <table>
                      <thead>
                        <tr>
                          <th style={{ paddingLeft: 14 }}>#</th>
                          <th>CLIENTE</th><th>TOTAL</th><th>ESTADO</th><th>PAGO</th>
                          <th>FECHA</th><th style={{ paddingRight: 14 }}>ACCIONES</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pedsFiltrados.length === 0
                          ? <tr><td colSpan={7} style={{ textAlign: 'center', color: '#9ca3af', padding: 20 }}>Sin pedidos</td></tr>
                          : pedsFiltrados.map(p => (
                            <tr key={p.id}>
                              <td style={{ paddingLeft: 14 }}>
                                <span style={{ fontWeight: 600, color: '#c0405f' }}>#{p.id}</span>
                              </td>
                              <td style={{ fontSize: 12 }}>
                                <div style={{ fontWeight: 500 }}>{p.nombre_cliente || '—'}</div>
                                <div style={{ fontSize: 10, color: '#9ca3af' }}>{p.telefono || ''}</div>
                              </td>
                              <td style={{ fontWeight: 500 }}>{fmt(p.total)}</td>
                              <td><span className={`badge ${estadoBadge(p.estado)}`}>{p.estado}</span></td>
                              <td><span className={`badge ${pagoBadge(p.estado_pago)}`}>{p.estado_pago || '—'}</span></td>
                              <td style={{ fontSize: 11, color: '#9ca3af' }}>{p.creado_at ? new Date(p.creado_at).toLocaleDateString('es-CO') : '—'}</td>
                              <td style={{ paddingRight: 14 }}>
                                <div className="arow">
                                  <button className="abtn" onClick={() => verDetalle(p.id)}>Ver</button>
                                  {p.estado === 'pendiente' && <button className="abtn" onClick={() => cambiarEstadoPedido(p.id, 'confirmado')}>Confirmar</button>}
                                  {p.estado === 'confirmado' && <button className="abtn" onClick={() => cambiarEstadoPedido(p.id, 'enviado')}>Enviar</button>}
                                  {p.estado === 'enviado' && <button className="abtn" onClick={() => cambiarEstadoPedido(p.id, 'entregado')}>Entregado</button>}
                                  {!['cancelado', 'entregado'].includes(p.estado) && (
                                    <button className="abtn d" onClick={() => cambiarEstadoPedido(p.id, 'cancelado')}>Cancelar</button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              {/* ══ CLIENTES ══ */}
              <div className={`panel${seccion === 'clientes' ? ' on' : ''}`}>
                <div className="search-row">
                  <input className="sinput" type="text" placeholder="🔍 Buscar por nombre, teléfono o correo…" value={busquedaCliente} onChange={e => setBusquedaCliente(e.target.value)} />
                </div>
                <div className="card" style={{ padding: 0 }}>
                  {loadingClients ? <div className="loading">Cargando clientes…</div> : (
                    <table>
                      <thead>
                        <tr>
                          <th style={{ paddingLeft: 14 }}>CLIENTE</th>
                          <th>CÉDULA</th><th>TELÉFONO</th><th>CORREO</th><th>CIUDAD</th><th>PEDIDOS</th>
                          <th style={{ paddingRight: 14 }}>REGISTRO</th>
                        </tr>
                      </thead>
                      <tbody>
                        {clientesFiltrados.length === 0
                          ? <tr><td colSpan={7} style={{ textAlign: 'center', color: '#9ca3af', padding: 20 }}>Sin clientes</td></tr>
                          : clientesFiltrados.map(c => {
                            const numPedidos = pedidos.filter(p => p.cliente_id === c.id).length;
                            return (
                              <tr key={c.id}>
                                <td style={{ paddingLeft: 14 }}><div style={{ fontSize: 12, fontWeight: 500 }}>{c.nombre_completo}</div></td>
                                <td style={{ fontSize: 11, color: '#9ca3af' }}>{c.cedula}</td>
                                <td style={{ fontSize: 12 }}>{c.telefono}</td>
                                <td style={{ fontSize: 11, color: '#6b7280' }}>{c.correo}</td>
                                <td>{c.ciudad}</td>
                                <td><span className="badge b-pink">{numPedidos}</span></td>
                                <td style={{ paddingRight: 14, fontSize: 11, color: '#9ca3af' }}>
                                  {c.creado_at ? new Date(c.creado_at).toLocaleDateString('es-CO') : '—'}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

            </div>{/* /body */}
          </div>{/* /main */}
        </div>{/* /shell */}
      </div>

      {/* ══ MODAL DETALLE PEDIDO (mejorado) ══ */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && cerrarModal()}>
          <div className="modal-box">
            <div className="modal-header">
              <div>
                <div className="modal-title">
                  🧾 Pedido {detallePedido ? `#${detallePedido.pedido.id}` : '…'}
                </div>
                {detallePedido && (
                  <span className={`badge ${estadoBadge(detallePedido.pedido.estado)}`} style={{ marginTop: 4, display: 'inline-block' }}>
                    {detallePedido.pedido.estado}
                  </span>
                )}
              </div>
              <button className="modal-close" onClick={cerrarModal}>✕</button>
            </div>

            <div className="modal-body">
              {loadingModal ? (
                <div className="loading">Cargando detalle…</div>
              ) : detallePedido ? (
                <>
                  {/* Datos del cliente */}
                  <div className="two-col" style={{ marginBottom: 16 }}>
                    <div style={{ background: '#f9fafb', borderRadius: 10, padding: '12px 14px' }}>
                      <div style={{ fontSize: 10, color: '#9ca3af', fontWeight: 500, marginBottom: 8, letterSpacing: '.3px' }}>DATOS DEL CLIENTE</div>
                      <div style={{ fontSize: 13, lineHeight: 1.9 }}>
                        <div><strong>{detallePedido.pedido.nombre_completo}</strong></div>
                        <div style={{ color: '#6b7280', fontSize: 12 }}>📞 {detallePedido.pedido.telefono}</div>
                        <div style={{ color: '#6b7280', fontSize: 12 }}>📍 {detallePedido.pedido.direccion}</div>
                        {detallePedido.pedido.ciudad && <div style={{ color: '#6b7280', fontSize: 12 }}>🏙 {detallePedido.pedido.ciudad}</div>}
                      </div>
                    </div>
                    <div style={{ background: '#f9fafb', borderRadius: 10, padding: '12px 14px' }}>
                      <div style={{ fontSize: 10, color: '#9ca3af', fontWeight: 500, marginBottom: 8, letterSpacing: '.3px' }}>CAMBIAR ESTADO</div>
                      <div className="estado-selector">
                        {ESTADOS.map(e => (
                          <button
                            key={e}
                            className={`estado-btn${detallePedido.pedido.estado === e ? ' active' : ''}`}
                            onClick={() => cambiarEstadoDesdeModal(e)}
                            disabled={detallePedido.pedido.estado === e}
                          >
                            {e}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Productos */}
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 10, color: '#9ca3af', fontWeight: 500, marginBottom: 8, letterSpacing: '.3px' }}>PRODUCTOS</div>
                    <table>
                      <thead>
                        <tr>
                          <th>Producto</th>
                          <th style={{ textAlign: 'center' }}>Cant.</th>
                          <th style={{ textAlign: 'right' }}>Precio unit.</th>
                          <th style={{ textAlign: 'right' }}>Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {detallePedido.productos.map((p, i) => (
                          <tr key={i}>
                            <td style={{ fontWeight: 500 }}>{p.nombre}</td>
                            <td style={{ textAlign: 'center' }}>{p.cantidad}</td>
                            <td style={{ textAlign: 'right', color: '#6b7280' }}>{fmt(p.precio_unitario)}</td>
                            <td style={{ textAlign: 'right', fontWeight: 500 }}>{fmt(p.subtotal)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div style={{ textAlign: 'right', padding: '10px 10px 0', fontSize: 15, fontWeight: 600, color: '#c0405f', borderTop: '0.5px solid #e5e7eb', marginTop: 4 }}>
                      Total: {fmt(detallePedido.pedido.total)}
                    </div>
                  </div>

                  {/* Timeline */}
                  {timeline.length > 0 && (
                    <div>
                      <div style={{ fontSize: 10, color: '#9ca3af', fontWeight: 500, marginBottom: 12, letterSpacing: '.3px' }}>HISTORIAL DE ESTADOS</div>
                      <div className="timeline">
                        {timeline.map((t, i) => (
                          <div key={i} className="tl-item">
                            <div className={`tl-dot ${t.estado === 'entregado' ? 'done' : t.estado === 'cancelado' ? 'gray' : ''}`}></div>
                            <div className="tl-label">{t.estado.charAt(0).toUpperCase() + t.estado.slice(1)}</div>
                            <div className="tl-date">{new Date(t.fecha).toLocaleString('es-CO')}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : null}
            </div>

            {/* Footer con acciones */}
            {detallePedido && (
              <div className="modal-footer">
                <button className="btn-s" onClick={cerrarModal}>Cerrar</button>
                <button className="btn-print" onClick={imprimirFactura}>🖨 Imprimir factura</button>
                <button className="btn-wa" onClick={() => abrirWhatsApp(detallePedido.pedido)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  WhatsApp cliente
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══ TOAST notificación pedido nuevo ══ */}
      {toast && (
        <div className="toast">
          <span className="toast-icon">🛍️</span>
          <span>{toast}</span>
          <button className="toast-close" onClick={() => setToast(null)}>✕</button>
        </div>
      )}

    </div>
  );
}

function NavItem({ id, label, seccion, onClick, badge, badgePulse, children }) {
  return (
    <div className={`nitem${seccion === id ? ' active' : ''}`} onClick={() => onClick(id)}>
      {children}
      {label}
      {badge != null && <span className={`nbadge${badgePulse ? ' pulse' : ''}`}>{badge}</span>}
    </div>
  );
}
