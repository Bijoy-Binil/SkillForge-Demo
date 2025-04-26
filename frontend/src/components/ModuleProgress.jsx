import { useState, useEffect } from 'react';
import { CheckCircleIcon, ClockIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';
import learningService from '../api/learningService';
import './ModuleProgress.css';

export default function ModuleProgress({ moduleId, pathId, onModuleCompleted, initialCompleted = false }) {
  // ... keep all existing logic and state ...

  if (!module) {
    return <div className="module-loading">Loading module...</div>;
  }

  return (
    <div className={`module-card ${isCompleted ? 'completed' : ''}`}>
      <div className="module-header">
        <div className="module-content">
          <h3 className="module-title">{module.title}</h3>
          <p className="module-description">{module.description}</p>
          
          <div className="module-meta">
            <span className="meta-item">
              <ClockIcon className="meta-icon" />
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
            <CheckCircleSolidIcon className="status-icon completed" />
          ) : (
            <button 
              onClick={handleMarkCompleted}
              disabled={loading}
              className="status-button"
            >
              <CheckCircleIcon className="status-icon" />
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
              Open Resource <ArrowTopRightOnSquareIcon className="button-icon" />
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