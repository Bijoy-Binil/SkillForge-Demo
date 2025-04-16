import { useState, useEffect } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  ArcElement,
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import learningService from '../api/learningService';
import { 
  ChartBarIcon, 
  ClockIcon, 
  CheckCircleIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function ProgressStats({ pathId }) {
  const [summary, setSummary] = useState(null);
  const [timeStats, setTimeStats] = useState([]);
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      
      try {
        // Fetch progress summary
        if (pathId) {
          const summaryData = await learningService.getProgressSummary(pathId);
          setSummary(summaryData);
        }
        
        // Fetch time stats
        const statsData = await learningService.getLearningTimeStats(days);
        setTimeStats(statsData);
      } catch (err) {
        console.error('Error fetching progress stats:', err);
        setError('Failed to load progress statistics');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [pathId, days]);
  
  const handleDaysChange = (newDays) => {
    setDays(newDays);
  };
  
  // Prepare data for pie chart
  const pieData = {
    labels: ['Completed', 'Remaining'],
    datasets: [
      {
        data: summary ? [
          summary.completed_modules,
          summary.total_modules - summary.completed_modules
        ] : [0, 1],
        backgroundColor: ['#10B981', '#E5E7EB'],
        borderWidth: 0,
      },
    ],
  };
  
  // Prepare data for bar chart
  const barData = {
    labels: timeStats.map(stat => {
      const date = new Date(stat.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        label: 'Minutes Spent Learning',
        data: timeStats.map(stat => stat.minutes),
        backgroundColor: '#6366F1',
      },
    ],
  };
  
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Daily Learning Time',
      },
    },
  };
  
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Module Completion',
      },
    },
  };
  
  if (loading) {
    return (
      <div className="text-center p-8">
        <ArrowPathIcon className="animate-spin h-10 w-10 mx-auto text-primary-600" />
        <p className="mt-2 text-gray-600">Loading statistics...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center p-8 text-red-600">
        <ExclamationTriangleIcon className="h-10 w-10 mx-auto" />
        <p className="mt-2">{error}</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Progress Statistics</h2>
      
      {/* Progress Summary */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <div className="flex items-center mb-2">
              <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
              <h3 className="text-sm font-medium text-gray-700">Module Completion</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {summary.completed_modules} / {summary.total_modules}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {Math.round(summary.completion_percentage)}% complete
            </p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="flex items-center mb-2">
              <ClockIcon className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="text-sm font-medium text-gray-700">Time Invested</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {summary.total_time_spent} min
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {Math.round(summary.total_time_spent / 60)} hours total
            </p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <div className="flex items-center mb-2">
              <ChartBarIcon className="h-5 w-5 text-purple-600 mr-2" />
              <h3 className="text-sm font-medium text-gray-700">Learning Pace</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {timeStats.length > 0 
                ? Math.round(timeStats.reduce((sum, stat) => sum + stat.minutes, 0) / timeStats.length)
                : 0} min/day
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Average over the last {days} days
            </p>
          </div>
        </div>
      )}
      
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-80">
          <Pie data={pieData} options={pieOptions} />
        </div>
        
        <div>
          <div className="mb-3 flex justify-end">
            <div className="inline-flex rounded-md shadow-sm">
              <button
                type="button"
                onClick={() => handleDaysChange(7)}
                className={`relative inline-flex items-center rounded-l-md px-3 py-1 text-sm font-semibold ${
                  days === 7 ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                } ring-1 ring-inset ring-gray-300 focus:z-10`}
              >
                7 days
              </button>
              <button
                type="button"
                onClick={() => handleDaysChange(14)}
                className={`relative -ml-px inline-flex items-center px-3 py-1 text-sm font-semibold ${
                  days === 14 ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                } ring-1 ring-inset ring-gray-300 focus:z-10`}
              >
                14 days
              </button>
              <button
                type="button"
                onClick={() => handleDaysChange(30)}
                className={`relative -ml-px inline-flex items-center rounded-r-md px-3 py-1 text-sm font-semibold ${
                  days === 30 ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                } ring-1 ring-inset ring-gray-300 focus:z-10`}
              >
                30 days
              </button>
            </div>
          </div>
          
          <div className="h-72">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      </div>
      
      {!summary && pathId && (
        <div className="text-center py-4 text-gray-500">
          No progress data available for this learning path.
        </div>
      )}
    </div>
  );
} 