import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import learningService from '../api/learningService';
import { 
  SparklesIcon, 
  ClockIcon, 
  AcademicCapIcon,
  ArrowPathIcon 
} from '@heroicons/react/24/outline';

const GOAL_SUGGESTIONS = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'React Developer',
  'Python Developer',
  'Data Scientist',
  'Machine Learning Engineer',
  'DevOps Engineer',
  'Mobile App Developer'
];

export default function LearningPathGenerator() {
  const [goal, setGoal] = useState('');
  const [durationWeeks, setDurationWeeks] = useState(4);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!goal) {
      setError('Please enter a learning goal');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Call the API to generate a learning path
      const learningPath = await learningService.generateLearningPath(goal, durationWeeks);
      
      // Navigate to the learning path detail page
      navigate(`/learning/${learningPath.id}`);
    } catch (err) {
      console.error('Error generating learning path:', err);
      setError(err.response?.data?.error || 'Failed to generate learning path. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setGoal(suggestion);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        <SparklesIcon className="h-7 w-7 text-primary-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900">AI Learning Path Generator</h2>
      </div>
      
      <p className="text-gray-600 mb-6">
        Enter your learning goal, and our AI will create a personalized learning path with curated resources.
      </p>
      
      {error && (
        <div className="bg-red-50 text-red-800 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-1">
            What would you like to learn?
          </label>
          <input
            type="text"
            id="goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="e.g., Frontend Developer, Data Science, Cloud Engineering"
            className="block w-full rounded-md border-gray-300 py-3 px-4 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            disabled={loading}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Suggestions:
          </label>
          <div className="flex flex-wrap gap-2">
            {GOAL_SUGGESTIONS.map(suggestion => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm hover:bg-gray-200 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
            Duration
          </label>
          <div className="flex items-center">
            <select
              id="duration"
              value={durationWeeks}
              onChange={(e) => setDurationWeeks(Number(e.target.value))}
              className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
              disabled={loading}
            >
              <option value={1}>1 week</option>
              <option value={2}>2 weeks</option>
              <option value={4}>4 weeks</option>
              <option value={8}>8 weeks</option>
              <option value={12}>12 weeks</option>
            </select>
            <ClockIcon className="ml-2 h-5 w-5 text-gray-400" />
          </div>
        </div>
        
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full justify-center items-center rounded-md bg-primary-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-70"
          >
            {loading ? (
              <>
                <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-5 w-5" />
                Generating your learning path...
              </>
            ) : (
              <>
                <AcademicCapIcon className="-ml-1 mr-2 h-5 w-5" />
                Generate Learning Path
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 