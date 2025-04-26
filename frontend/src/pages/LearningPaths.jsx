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
import learningService from '../api/learningService'; // Assuming learningService handles your data fetching
import LearningPathGenerator from '../components/LearningPathGenerator';

export default function LearningPaths() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showGenerator, setShowGenerator] = useState(false);
  const [myPaths, setMyPaths] = useState([]);
  const [allPaths, setAllPaths] = useState([]);

  // Fetching paths data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Start loading
        const myPathsData = await learningService.getMyPaths();
        const allPathsData = await learningService.getAllPaths();
        
        setMyPaths(myPathsData);
        setAllPaths(allPathsData);
        setLoading(false); // Set loading to false once data is fetched
      } catch (err) {
        setError('Failed to fetch learning paths');
        setLoading(false); // Stop loading on error
      }
    };

    fetchData();
  }, []); // Empty dependency array means this runs once on component mount

  // Toggle the generator
  const toggleGenerator = () => {
    setShowGenerator((prev) => !prev);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <ArrowPathIcon className="loading-spinner" />
        <p className="loading-text">Loading learning paths...</p>
      </div>
    );
  }

  return (
    <div className="learning-paths-container">
      <div className="header-container">
        <div className="header-content">
          <h1 className="main-title">Learning Paths</h1>
          <p className="subtitle">
            Track your progress through guided learning paths or discover new ones.
          </p>
        </div>
        
        <button onClick={toggleGenerator} className="btn btn-primary">
          {showGenerator ? (
            'Hide Generator'
          ) : (
            <>
              <SparklesIcon className="icon-md" />
              Generate with AI
            </>
          )}
        </button>
      </div>
      
      {error && (
        <div className="error-alert">
          {error}
        </div>
      )}
      
      {showGenerator && (
        <div className="generator-container">
          <LearningPathGenerator />
        </div>
      )}
      
      {/* My Enrolled Paths */}
      <div className="section-container">
        <h2 className="section-title">My Learning Paths</h2>
        
        {myPaths.length === 0 ? (
          <p className="empty-state">
            You haven't enrolled in any learning paths yet. Browse the available paths below or create your own.
          </p>
        ) : (
          <div className="paths-grid">
            {myPaths.map((path) => (
              <Link 
                key={path.id} 
                to={`/learning/${path.id}`}
                className="path-card enrolled"
              >
                <div className="path-header">
                  <AcademicCapIcon className="icon-md path-icon" />
                  <h3 className="path-title">{path.title}</h3>
                </div>
                
                <p className="path-description">{path.description}</p>
                
                <div className="path-meta">
                  <div className="meta-item">
                    <ClockIcon className="icon-sm" />
                    {path.estimated_hours} hours estimated
                  </div>
                </div>
                
                <div className="progress-container">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${path.progress_percentage || 0}%` }}
                    ></div>
                  </div>
                  <p className="progress-text">
                    {Math.round(path.progress_percentage || 0)}% complete
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      
      {/* Available Paths */}
      <div className="section-container">
        <h2 className="section-title">Discover Learning Paths</h2>
        
        {allPaths.length === 0 ? (
          <p className="empty-state">No additional learning paths are available at the moment.</p>
        ) : (
          <div className="paths-grid">
            {allPaths.map((path) => (
              <div key={path.id} className="path-card">
                <div className="path-header">
                  <AcademicCapIcon className="icon-md path-icon" />
                  <h3 className="path-title">{path.title}</h3>
                </div>
                
                <p className="path-description">{path.description}</p>
                
                <div className="path-details">
                  <div className="detail-item">
                    <ClockIcon className="icon-sm" />
                    {path.estimated_hours} hours
                  </div>
                  <div className="detail-item">
                    <BookOpenIcon className="icon-sm" />
                    {path.modules?.length || 0} modules
                  </div>
                </div>
                
                {path.creator_details && (
                  <div className="creator-info">
                    <UserIcon className="icon-sm" />
                    <span>Created by {path.creator_details.first_name} {path.creator_details.last_name}</span>
                  </div>
                )}
                
                <button className="btn btn-secondary full-width">
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
