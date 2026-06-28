import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ children, adminOnly = false }) {
  const { usuario } = useAuth();

  // ❌ No está logueado
  if (!usuario) {
    return <Navigate to="/login" />;
  }

  // ❌ No es admin
  if (adminOnly && usuario.rol !== 'admin') {
    return <Navigate to="/" />;
  }

  // ✅ Todo bien
  return children;
}