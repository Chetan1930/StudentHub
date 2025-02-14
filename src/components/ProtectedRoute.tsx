// import { Navigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// export default function ProtectedRoute({ children }) {
//   const { user } = useAuth();
//   const location = useLocation();

//   if (!user) {
//     // Redirect to signin but save the attempted URL
//     return <Navigate to="/signin" state={{ from: location.pathname }} replace />;
//   }

//   return children;
// }
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // Prevent premature redirect before loading completes

  return user ? children : <Navigate to="/signin" state={{ from: location.pathname }} replace />;
}