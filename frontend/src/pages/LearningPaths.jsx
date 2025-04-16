import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  AcademicCapIcon,
  BookOpenIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  ArrowPathIcon,
  UserIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import learningService from '../api/learningService';
import LearningPathGenerator from '../components/LearningPathGenerator';

// Mock data, in a real app this would come from an API
const mockLearningPaths = [
  {
    id: 1,
    title: 'Frontend Web Development',
    description: 'Learn HTML, CSS, JavaScript, and React to build modern web applications.',
    skillCount: 15,
    estimatedHours: 80,
    enrolled: true,
    progress: 65,
    creator: {
      name: 'John Smith',
      role: 'Senior Frontend Developer'
    }
  },
  {
    id: 2,
    title: 'Data Science Fundamentals',
    description: 'Master the basics of data science, including statistics, Python, and machine learning.',
    skillCount: 12,
    estimatedHours: 60,
    enrolled: true,
    progress: 25,
    creator: {
      name: 'Sarah Johnson',
      role: 'Data Scientist'
    }
  },
  {
    id: 3,
    title: 'Machine Learning Engineer',
    description: 'Learn the fundamentals of machine learning and AI.',
    skillCount: 8,
    estimatedHours: 40,
    enrolled: false,
    creator: {
      name: 'Michael Chen',
      role: 'ML Engineer'
    }
  },
  {
    id: 4,
    title: 'Full Stack JavaScript',
    description: 'Master Node.js, React, and related technologies.',
    skillCount: 12,
    estimatedHours: 60,
    enrolled: false,
    creator: {
      name: 'Lisa Wang',
      role: 'Full Stack Developer'
    }
  },
];

export default function LearningPaths() {
  const [myPaths, setMyPaths] = useState([]);
  const [allPaths, setAllPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showGenerator, setShowGenerator] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // all, enrolled, created

  useEffect(() => {
    const fetchPaths = async () => {
      setLoading(true);
      setError('');
      
      try {
        // Get paths the user is enrolled in
        const enrolledPaths = await learningService.getMyEnrolledPaths();
        setMyPaths(enrolledPaths);
        
        // Get all paths
        const allPathsData = await learningService.getLearningPaths();
        
        // Filter out paths the user is already enrolled in
        const filteredPaths = allPathsData.filter(path => 
          !enrolledPaths.some(myPath => myPath.id === path.id)
        );
        
        setAllPaths(filteredPaths);
      } catch (err) {
        console.error('Error fetching learning paths:', err);
        setError('Failed to load learning paths');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPaths();
  }, []);
  
  const toggleGenerator = () => {
    setShowGenerator(!showGenerator);
  };
  
  const filteredPaths = mockLearningPaths.filter(path => {
    const matchesSearch = path.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         path.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'enrolled') return matchesSearch && path.enrolled;
    if (filter === 'created') return matchesSearch && path.creator.name === 'John Smith'; // Just for demo
    
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="text-center py-12">
        <ArrowPathIcon className="h-12 w-12 mx-auto animate-spin text-primary-600" />
        <p className="mt-4 text-lg text-gray-600">Loading learning paths...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Learning Paths</h1>
          <p className="mt-2 text-md text-gray-700">
            Track your progress through guided learning paths or discover new ones.
          </p>
        </div>
        
        <div>
          <button
            onClick={toggleGenerator}
            className="btn btn-primary inline-flex items-center"
          >
            {showGenerator ? (
              <>Hide Generator</>
            ) : (
              <>
                <SparklesIcon className="-ml-1 mr-1 h-5 w-5" />
                Generate with AI
              </>
            )}
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-6">
          {error}
        </div>
      )}
      
      {showGenerator && (
        <div className="mb-8">
          <LearningPathGenerator />
        </div>
      )}
      
      {/* My Enrolled Paths */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">My Learning Paths</h2>
        
        {myPaths.length === 0 ? (
          <p className="text-gray-600">
            You haven't enrolled in any learning paths yet. Browse the available paths below or create your own.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myPaths.map(path => (
              <Link 
                key={path.id} 
                to={`/learning/${path.id}`}
                className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center mb-3">
                  <AcademicCapIcon className="h-6 w-6 text-primary-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900 truncate">{path.title}</h3>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-2">{path.description}</p>
                
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  <span>{path.estimated_hours} hours estimated</span>
                </div>
                
                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                  <div 
                    className="bg-primary-600 h-2.5 rounded-full" 
                    style={{ width: `${path.progress_percentage || 0}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">{Math.round(path.progress_percentage || 0)}% complete</p>
              </Link>
            ))}
          </div>
        )}
      </div>
      
      {/* Available Paths */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Discover Learning Paths</h2>
        
        {allPaths.length === 0 ? (
          <p className="text-gray-600">No additional learning paths are available at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allPaths.map(path => (
              <div 
                key={path.id} 
                className="bg-white rounded-lg border border-gray-200 p-5"
              >
                <div className="flex items-center mb-3">
                  <AcademicCapIcon className="h-6 w-6 text-gray-400 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900 truncate">{path.title}</h3>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-2">{path.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    <span>{path.estimated_hours} hours</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <BookOpenIcon className="h-4 w-4 mr-1" />
                    <span>{path.modules?.length || 0} modules</span>
                  </div>
                </div>
                
                {path.creator_details && (
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <UserIcon className="h-4 w-4 mr-1" />
                    <span>Created by {path.creator_details.first_name} {path.creator_details.last_name}</span>
                  </div>
                )}
                
                <button className="btn btn-secondary w-full">
                  Enroll Now
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 