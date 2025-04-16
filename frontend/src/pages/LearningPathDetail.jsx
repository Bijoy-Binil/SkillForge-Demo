import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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

export default function LearningPathDetail() {
  const { id } = useParams();
  const [learningPath, setLearningPath] = useState(null);
  const [modules, setModules] = useState([]);
  const [showStats, setShowStats] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      
      try {
        // Get all learning paths to find the one with the matching ID
        const paths = await learningService.getMyEnrolledPaths();
        const path = paths.find(p => p.id === parseInt(id));
        
        if (path) {
          setLearningPath(path);
          
          // Get modules for this path
          const modulesData = await learningService.getModulesByPath(id);
          setModules(modulesData);
        } else {
          setError('Learning path not found or you are not enrolled');
        }
      } catch (err) {
        console.error('Error fetching learning path:', err);
        setError('Failed to load learning path data');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchData();
    }
  }, [id]);
  
  const handleModuleCompleted = (moduleId) => {
    // Update the local state to reflect the completed module
    setModules(prevModules => 
      prevModules.map(module => 
        module.id === moduleId 
          ? { ...module, completed: true } 
          : module
      )
    );
  };
  
  if (loading) {
    return (
      <div className="text-center py-12">
        <ArrowPathIcon className="h-12 w-12 mx-auto animate-spin text-primary-600" />
        <p className="mt-4 text-lg text-gray-600">Loading learning path...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-12">
        <ExclamationTriangleIcon className="h-12 w-12 mx-auto text-red-600" />
        <p className="mt-4 text-lg text-red-600">{error}</p>
        <Link to="/learning" className="btn btn-primary mt-4 inline-flex items-center">
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Learning Paths
        </Link>
      </div>
    );
  }
  
  if (!learningPath) {
    return null;
  }
  
  const completedModulesCount = modules.filter(module => module.completed).length;
  const progressPercentage = modules.length > 0 
    ? Math.round((completedModulesCount / modules.length) * 100) 
    : 0;
  
  return (
    <div>
      <div className="mb-6">
        <Link to="/learning" className="text-primary-600 hover:text-primary-800 inline-flex items-center mb-4">
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Learning Paths
        </Link>
        
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">{learningPath.title}</h1>
          
          <button 
            onClick={() => setShowStats(!showStats)}
            className="btn btn-sm btn-secondary"
          >
            {showStats ? 'Hide Stats' : 'Show Stats'}
          </button>
        </div>
        
        <p className="mt-2 text-gray-600">{learningPath.description}</p>
        
        <div className="mt-4 flex items-center">
          <div className="flex items-center text-sm text-gray-500 mr-4">
            <ClockIcon className="h-4 w-4 mr-1" />
            {learningPath.estimated_hours} hours estimated
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <AcademicCapIcon className="h-4 w-4 mr-1" />
            {learningPath.is_ai_generated ? 'AI Generated' : 'Custom'}
          </div>
        </div>
        
        <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-primary-600 h-2.5 rounded-full" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-1">{progressPercentage}% complete</p>
      </div>
      
      {/* Toggle Stats/Modules View */}
      {showStats ? (
        <ProgressStats pathId={id} />
      ) : (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Learning Modules</h2>
          
          {modules.length === 0 ? (
            <p className="text-gray-600">No modules found in this learning path.</p>
          ) : (
            <div className="space-y-6">
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