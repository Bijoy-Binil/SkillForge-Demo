import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './LearningPathDetail.css'
import { 
  AcademicCapIcon, 
  ArrowLeftIcon, 
  ArrowPathIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import learningService from '../api/learningService';
import ModuleProgress from '../components/ModuleProgress';
import ProgressStats from '../components/ProgressStats';
// import './LearningPathDetail.css';

export default function LearningPathDetail() {
  const { id } = useParams();
  const [learningPath, setLearningPath] = useState(null);
  const [modules, setModules] = useState([]);
  const [showStats, setShowStats] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // ... (keep all the existing logic the same)

  if (loading) {
    return (
      <div className="loading-container">
        <ArrowPathIcon className="loading-spinner" />
        <p className="loading-text">Loading learning path...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="error-container">
        <ExclamationTriangleIcon className="error-icon" />
        <p className="error-message">{error}</p>
        <Link to="/learning" className="btn btn-primary">
          <ArrowLeftIcon className="icon-sm" />
          Back to Learning Paths
        </Link>
      </div>
    );
  }

  return (
    <div className="learning-path-container">
      <div className="path-header">
        <Link to="/learning" className="back-link">
          <ArrowLeftIcon className="icon-sm" />
          Back to Learning Paths
        </Link>
        
        <div className="header-row">
          <h1 className="path-title">{learningPath.title}</h1>
          <button 
            onClick={() => setShowStats(!showStats)}
            className="btn btn-secondary btn-sm"
          >
            {showStats ? 'Hide Stats' : 'Show Stats'}
          </button>
        </div>
        
        <p className="path-description">{learningPath.description}</p>
        
        <div className="path-meta">
          <div className="meta-item">
            <ClockIcon className="meta-icon" />
            {learningPath.estimated_hours} hours estimated
          </div>
          <div className="meta-item">
            <AcademicCapIcon className="meta-icon" />
            {learningPath.is_ai_generated ? 'AI Generated' : 'Custom'}
          </div>
        </div>
        
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="progress-text">{progressPercentage}% complete</p>
      </div>
      
      {showStats ? (
        <ProgressStats pathId={id} />
      ) : (
        <div className="modules-section">
          <h2 className="modules-title">Learning Modules</h2>
          {modules.length === 0 ? (
            <p className="no-modules">No modules found in this learning path.</p>
          ) : (
            <div className="modules-list">
              {modules.map((module) => (
                <ModuleProgress 
                  key={module.id}
                  moduleId={module.id}
                  pathId={id}
                  initialCompleted={module.completed}
                  onModuleCompleted={handleModuleCompleted}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}