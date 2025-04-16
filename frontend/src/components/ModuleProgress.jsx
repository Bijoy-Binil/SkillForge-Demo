import { useState, useEffect } from 'react';
import { CheckCircleIcon, ClockIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';
import learningService from '../api/learningService';

export default function ModuleProgress({ moduleId, pathId, onModuleCompleted, initialCompleted = false }) {
  const [module, setModule] = useState(null);
  const [isCompleted, setIsCompleted] = useState(initialCompleted);
  const [timeSpent, setTimeSpent] = useState(0);
  const [notes, setNotes] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch module data if moduleId is provided
    const fetchModule = async () => {
      try {
        const modules = await learningService.getModulesByPath(pathId);
        const foundModule = modules.find(m => m.id === moduleId);
        if (foundModule) {
          setModule(foundModule);
        }
      } catch (err) {
        console.error('Error fetching module:', err);
        setError('Failed to load module information');
      }
    };

    if (moduleId && pathId) {
      fetchModule();
    }
  }, [moduleId, pathId]);

  useEffect(() => {
    // Update isCompleted when initialCompleted changes
    setIsCompleted(initialCompleted);
  }, [initialCompleted]);

  // Update timer when tracking is active
  useEffect(() => {
    let interval;
    
    if (isTracking && startTime) {
      interval = setInterval(() => {
        const elapsedMinutes = Math.floor((Date.now() - startTime) / 60000);
        setTimeSpent(elapsedMinutes);
      }, 60000); // Update every minute
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking, startTime]);

  const handleStartTracking = () => {
    setIsTracking(true);
    setStartTime(Date.now());
  };

  const handleStopTracking = () => {
    setIsTracking(false);
  };

  const handleMarkCompleted = async () => {
    if (isCompleted) return;
    
    setLoading(true);
    
    try {
      await learningService.markModuleCompleted(moduleId, timeSpent, notes);
      setIsCompleted(true);
      
      // Stop tracking if active
      if (isTracking) {
        handleStopTracking();
      }
      
      // Notify parent component
      if (onModuleCompleted) {
        onModuleCompleted(moduleId);
      }
    } catch (err) {
      console.error('Error marking module as completed:', err);
      setError('Failed to mark module as completed');
    } finally {
      setLoading(false);
    }
  };

  if (!module) {
    return <div className="p-4 bg-gray-50 rounded-md animate-pulse">Loading module...</div>;
  }

  return (
    <div className={`border rounded-lg p-4 mb-4 ${isCompleted ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-medium text-lg text-gray-900">{module.title}</h3>
          <p className="text-gray-600 mt-1">{module.description}</p>
          
          <div className="mt-3 flex items-center">
            <span className="inline-flex items-center mr-4 text-sm text-gray-500">
              <ClockIcon className="h-4 w-4 mr-1" />
              {module.estimated_hours} hours
            </span>
            
            <span className="inline-flex items-center text-sm text-gray-500 capitalize">
              <span className={`inline-block w-2 h-2 mr-1 rounded-full ${
                module.module_type === 'video' ? 'bg-red-500' : 
                module.module_type === 'article' ? 'bg-blue-500' : 
                module.module_type === 'exercise' ? 'bg-purple-500' : 'bg-yellow-500'
              }`}></span>
              {module.module_type}
            </span>
          </div>
        </div>
        
        <div className="ml-4">
          {isCompleted ? (
            <CheckCircleSolidIcon className="h-8 w-8 text-green-500" />
          ) : (
            <button 
              onClick={handleMarkCompleted}
              disabled={loading}
              className="text-primary-600 hover:text-primary-800"
            >
              <CheckCircleIcon className="h-8 w-8" />
            </button>
          )}
        </div>
      </div>
      
      {!isCompleted && (
        <div className="mt-4 border-t border-gray-100 pt-3">
          <div className="flex flex-wrap gap-2">
            <a 
              href={module.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-secondary inline-flex items-center"
            >
              Open Resource <ArrowTopRightOnSquareIcon className="ml-1 h-4 w-4" />
            </a>
            
            {isTracking ? (
              <button 
                onClick={handleStopTracking}
                className="btn btn-sm btn-danger"
              >
                Stop Tracking ({timeSpent} min)
              </button>
            ) : (
              <button 
                onClick={handleStartTracking}
                className="btn btn-sm btn-primary"
              >
                Start Tracking Time
              </button>
            )}
          </div>
          
          <div className="mt-3">
            <label htmlFor={`notes-${moduleId}`} className="block text-sm font-medium text-gray-700 mb-1">
              Notes (optional)
            </label>
            <textarea
              id={`notes-${moduleId}`}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="Add your notes about this module"
            ></textarea>
          </div>
        </div>
      )}
      
      {error && (
        <div className="mt-2 text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
}