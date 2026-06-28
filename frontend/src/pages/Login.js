import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email:'', password:'' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/login', form);
      login(data.token, data.usuario);
      navigate(data.usuario.rol === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al ingresar');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.titulo}>Ingresar</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input placeholder="Email" type="email" value={form.email}
            onChange={e => setForm({...form, email: e.target.value})}
            style={styles.input} required/>
          <input placeholder="Contraseña" type="password" value={form.password}
            onChange={e => setForm({...form, password: e.target.value})}
            style={styles.input} required/>
          <button type="submit" style={styles.btn}>Ingresar</button>
        </form>
        <p style={styles.link}>¿No tienes cuenta? <Link to="/registro">Regístrate</Link></p>
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
  link: { textAlign:'center', marginTop:'16px', fontSize:'14px', color:'#666' },
};
