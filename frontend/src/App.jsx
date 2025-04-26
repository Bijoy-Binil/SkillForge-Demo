import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import LearningPaths from './pages/LearningPaths';
import LearningPathDetail from './pages/LearningPathDetail';
import SkillsInProgress from './pages/SkillsInProgress';
import JobMatches from './pages/JobMatches';
import ResumeCompleteness from './pages/ResumeCompleteness';

// Test component to verify CSS
function CssTest() {
  return (
    <div className="test-container">
      <h1 className="test-title">CSS Test Page</h1>
      <div className="test-box">
        If you can see this box in blue color with white text, CSS is working!
      </div>
      <div className="button-container">
        <button className="btn btn-primary">Primary Button</button>
        <button className="btn btn-secondary">Secondary Button</button>
        <button className="btn btn-danger">Danger Button</button>
        <button className="btn btn-success">Success Button</button>
      </div>
      <div className="card">
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
              <Route path="/skills" element={<SkillsInProgress />} />
              <Route path="/jobs" element={<JobMatches />} />
              <Route path="/resume" element={<ResumeCompleteness />} />
            </Route>
          </Route>
          
          {/* Redirect root to dashboard or login */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* 404 route */}
          <Route path="*" element={
            <div className="not-found">
              <div className="not-found-content">
                <h1 className="not-found-title">404</h1>
                <p className="not-found-message">Page not found</p>
              </div>
            </div>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
