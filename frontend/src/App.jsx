import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import LearningPaths from './pages/LearningPaths';
import LearningPathDetail from './pages/LearningPathDetail';

// Test component to verify CSS
function CssTest() {
  return (
    <div style={{ padding: '40px' }}>
      <h1>CSS Test Page</h1>
      <div className="test-box">
        If you can see this box in blue color with white text, CSS is working!
      </div>
      <div style={{ marginTop: '20px' }}>
        <button className="btn btn-primary">Primary Button</button>
        <button className="btn btn-secondary" style={{ marginLeft: '10px' }}>Secondary Button</button>
        <button className="btn btn-danger" style={{ marginLeft: '10px' }}>Danger Button</button>
        <button className="btn btn-success" style={{ marginLeft: '10px' }}>Success Button</button>
      </div>
      <div className="card" style={{ marginTop: '20px', maxWidth: '500px' }}>
        <h3>Card Component</h3>
        <p>This is a card component with hover effects.</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Test route */}
          <Route path="/test-css" element={<CssTest />} />
          
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes with MainLayout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/learning" element={<LearningPaths />} />
              <Route path="/learning/:id" element={<LearningPathDetail />} />
              {/* Add more routes as needed */}
              <Route path="/skills" element={<div className="p-4">Skills page coming soon</div>} />
              <Route path="/jobs" element={<div className="p-4">Job matches page coming soon</div>} />
              <Route path="/resume" element={<div className="p-4">Resume page coming soon</div>} />
            </Route>
          </Route>
          
          {/* Redirect root to dashboard or login */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* 404 route */}
          <Route path="*" element={
            <div className="flex items-center justify-center h-screen">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900">404</h1>
                <p className="mt-2 text-lg text-gray-600">Page not found</p>
              </div>
            </div>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
