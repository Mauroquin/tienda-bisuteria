import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={s.nav}>
      {/* Hamburguesa */}
      <button style={s.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
        <span style={s.linea}/>
        <span style={s.linea}/>
        <span style={s.linea}/>
      </button>

      {/* Logo */}
<Link to="/" style={s.logoWrap}>
  <img src="/logo_aura.png" alt="Aura Artesanal" style={s.logoImg} />
</Link>

       {/* Iconos */}
       <div style={s.iconos}>
         <button style={s.iconBtn}>
           🔍
         </button>

         {usuario ? (
           <button style={s.iconBtn} onClick={handleLogout}>
             🚪
           </button>
         ) : (
           <Link to="/login" style={s.iconBtn}>
             👤
           </Link>
         )}
       </div>

      {/* Menú */}
      {menuOpen && (
        <div style={s.menu}>
          <Link to="/" style={s.menuLink} onClick={() => setMenuOpen(false)}>Inicio</Link>
          <Link to="/registro" style={s.menuLink} onClick={() => setMenuOpen(false)}>Registrarse</Link>
        </div>
      )}
    </nav>
  );
}

const s = {
  nav: {
  background: '#0f172a',
  padding: '0 16px',        // ← quita el padding vertical
  height: '86px',           // ← altura fija del navbar
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  position: 'sticky',
  top: 0,
  zIndex: 100,
},
  hamburger: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  linea: {
    width: '30px',
    height: '4px',
    background: 'white',
  },
  logoWrap: {
    textDecoration: 'none',
    textAlign: 'center',
    marginLeft: '100px',
  },
  logoMain: {
    fontSize: '22px',
    color: 'white',
    fontWeight: 'bold',
    letterSpacing: '4px',
    height: '78px',
    width: '130px'
  },
  logoA: {
    color: '#e8547a',
  },
  logoSub: {
    fontSize: '8px',
    color: '#aaa',
    letterSpacing: '5px',
  },
  iconos: {
    display: 'flex',
    gap: '8px',
  },
  iconBtn: {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '28px',
    cursor: 'pointer',
    borderRadius: '50%',
    padding: '6px',
  },
  menu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    background: '#0f172a',
    display: 'flex',
    flexDirection: 'column',
  },
  menuLink: {
    color: 'white',
    padding: '12px',
    textDecoration: 'none',
  },

  logoImg: {
  height: '134px',
  width: '180px',
  objectFit: 'contain',      // ← contain en lugar de cover, para ver todo el logo
  objectPosition: 'center',
  mixBlendMode: 'screen',    // ← hace el fondo negro invisible
},
};