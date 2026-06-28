import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function Registro() {
  const [form, setForm] = useState({ nombre:'', email:'', password:'' });
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/usuarios/registro', form);
      setExito(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al registrarse');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.titulo}>Crear cuenta</h2>
        {error && <p style={styles.error}>{error}</p>}
        {exito && <p style={styles.exito}>¡Cuenta creada! Redirigiendo...</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input placeholder="Nombre completo" value={form.nombre}
            onChange={e => setForm({...form, nombre: e.target.value})}
            style={styles.input} required/>
          <input placeholder="Email" type="email" value={form.email}
            onChange={e => setForm({...form, email: e.target.value})}
            style={styles.input} required/>
          <input placeholder="Contraseña" type="password" value={form.password}
            onChange={e => setForm({...form, password: e.target.value})}
            style={styles.input} required/>
          <button type="submit" style={styles.btn}>Registrarse</button>
        </form>
        <p style={styles.link}>¿Ya tienes cuenta? <Link to="/login">Ingresar</Link></p>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight:'100vh', background:'#f8f4ff', display:'flex',
          alignItems:'center', justifyContent:'center' },
  card: { background:'#fff', padding:'40px', borderRadius:'16px',
          boxShadow:'0 4px 24px rgba(0,0,0,0.1)', width:'100%', maxWidth:'380px' },
  titulo: { margin:'0 0 24px', color:'#1a1a2e', textAlign:'center' },
  form: { display:'flex', flexDirection:'column', gap:'14px' },
  input: { padding:'12px 16px', borderRadius:'8px', border:'1px solid #ddd',
           fontSize:'15px', outline:'none' },
  btn: { padding:'12px', background:'#9c27b0', color:'#fff', border:'none',
         borderRadius:'8px', fontSize:'16px', cursor:'pointer', fontWeight:'bold' },
  error: { color:'#e53935', background:'#ffebee', padding:'10px', borderRadius:'8px',
           fontSize:'13px', marginBottom:'8px' },
  exito: { color:'#2e7d32', background:'#e8f5e9', padding:'10px', borderRadius:'8px',
           fontSize:'13px', marginBottom:'8px' },
  link: { textAlign:'center', marginTop:'16px', fontSize:'14px', color:'#666' },
};
