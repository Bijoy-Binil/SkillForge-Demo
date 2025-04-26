import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ProtectedRoute.css';

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  // Show loading spinner if user data is still being loaded
  if (loading) {
    return (
      <div className="auth-loading-container">
        <div className="auth-spinner"></div> {/* You can customize this spinner */}
      </div>
    );
  }

  // Redirect to login page if the user is not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render the protected route content (children of ProtectedRoute)
  return <Outlet />;
}
