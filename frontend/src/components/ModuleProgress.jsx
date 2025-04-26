import { useState, useEffect } from 'react';
import learningService from '../api/learningService';
import './ModuleProgress.css';

export default function ModuleProgress({ moduleId, pathId, onModuleCompleted, initialCompleted = false }) {
  const [module, setModule] = useState(null);
  const [isCompleted, setIsCompleted] = useState(initialCompleted);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notes, setNotes] = useState('');
  const [timeSpent, setTimeSpent] = useState(0);
  const [isTracking, setIsTracking] = useState(false);

  // Assume we fetch the module data using learningService
  useEffect(() => {
    const fetchModuleData = async () => {
      setLoading(true);
      try {
        const fetchedModule = await learningService.getModule(moduleId); // This function should be defined in your service.
        setModule(fetchedModule);
      } catch (err) {
        setError('Failed to load module data');
      } finally {
        setLoading(false);
      }
    };
    fetchModuleData();
  }, [moduleId]);

  if (!module) {
    return <div className="module-loading">Loading module...</div>;
  }

  const handleMarkCompleted = () => {
    setIsCompleted(true);
    onModuleCompleted(moduleId);
  };

  const handleStartTracking = () => {
    setIsTracking(true);
    // Start tracking logic (e.g., setInterval for time tracking)
  };

  const handleStopTracking = () => {
    setIsTracking(false);
    // Stop tracking logic (e.g., clearInterval)
  };

  return (
    <div className={`module-card ${isCompleted ? 'completed' : ''}`}>
      <div className="module-header">
        <div className="module-content">
          <h3 className="module-title">{module.title}</h3>
          <p className="module-description">{module.description}</p>
          
          <div className="module-meta">
            <span className="meta-item">
              <span className="meta-icon clock-icon"></span> 
              {module.estimated_hours} hours
            </span>
            
            <span className={`module-type type-${module.module_type}`}>
              <span className="type-indicator"></span>
              {module.module_type}
            </span>
          </div>
        </div>
        
        <div className="module-status">
          {isCompleted ? (
            <span className="status-icon completed">✔</span> 
          ) : (
            <button 
              onClick={handleMarkCompleted}
              disabled={loading}
              className="status-button"
            >
              <span className="status-icon">✔</span>
            </button>
          )}
        </div>
      </div>
      
      {!isCompleted && (
        <div className="module-actions">
          <div className="action-buttons">
            <a 
              href={module.url}
              target="_blank"
              rel="noopener noreferrer"
              className="module-button secondary"
            >
              Open Resource <span className="button-icon">↗</span>
            </a>
            
            {isTracking ? (
              <button 
                onClick={handleStopTracking}
                className="module-button danger"
              >
                Stop Tracking ({timeSpent} min)
              </button>
            ) : (
              <button 
                onClick={handleStartTracking}
                className="module-button primary"
              >
                Start Tracking Time
              </button>
            )}
          </div>
          
          <div className="notes-container">
            <label htmlFor={`notes-${moduleId}`} className="notes-label">
              Notes (optional)
            </label>
            <textarea
              id={`notes-${moduleId}`}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="module-notes"
              placeholder="Add your notes about this module"
            ></textarea>
          </div>
        </div>
      )}
      
      {error && (
        <div className="module-error">
          {error}
        </div>
      )}
    </div>
  );
}
