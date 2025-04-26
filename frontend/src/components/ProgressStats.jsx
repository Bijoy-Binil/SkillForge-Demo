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
import './ProgressStats.css';

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
  const [loading, setLoading] = useState(true);  // Initialize loading state
  const [error, setError] = useState(null);  // Initialize error state
  const [summary, setSummary] = useState(null);  // Initialize summary state
  const [timeStats, setTimeStats] = useState([]);  // Initialize time stats state
  const [days, setDays] = useState(7);  // Initialize days state for the filter

  // Simulating an API call to fetch data for the example
  useEffect(() => {
    // Simulating API data fetching with a timeout
    setTimeout(() => {
      setLoading(false);  // Set loading to false once data is fetched
      setSummary({
        completed_modules: 5,
        total_modules: 10,
        completion_percentage: 50,
        total_time_spent: 300,
      });
      setTimeStats([
        { minutes: 60 },
        { minutes: 90 },
        { minutes: 120 },
        // More stats
      ]);
    }, 2000); // Simulate 2 seconds delay
  }, []);

  // Handle days filter change
  const handleDaysChange = (days) => {
    setDays(days);
  };

  // Pie chart data and options (define these variables)
  const pieData = {
    labels: ['Completed', 'Remaining'],
    datasets: [
      {
        data: [
          summary ? summary.completed_modules : 0,
          summary ? summary.total_modules - summary.completed_modules : 0,
        ],
        backgroundColor: ['#4CAF50', '#FFC107'],  // Colors for completed and remaining
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.label || '';
            if (context.raw !== undefined) {
              label += ': ' + context.raw + ' modules';
            }
            return label;
          },
        },
      },
    },
  };

  // Bar chart data and options (define these variables)
  const barData = {
    labels: timeStats.map((_, index) => `${index + 1}`),  // Label for each day
    datasets: [
      {
        label: 'Time Spent (min)',
        data: timeStats.map(stat => stat.minutes),
        backgroundColor: '#4CAF50',
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.raw} min`;
          },
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="stats-loading">
        <ArrowPathIcon className="loading-spinner" />
        <p className="loading-text">Loading statistics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stats-error">
        <ExclamationTriangleIcon className="error-icon" />
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="stats-container">
      <h2 className="stats-title">Progress Statistics</h2>

      {summary && (
        <div className="stats-grid">
          <div className="stat-card stat-completion">
            <div className="stat-header">
              <CheckCircleIcon className="stat-icon" />
              <h3 className="stat-label">Module Completion</h3>
            </div>
            <p className="stat-value">
              {summary.completed_modules} / {summary.total_modules}
            </p>
            <p className="stat-subtext">
              {Math.round(summary.completion_percentage)}% complete
            </p>
          </div>

          <div className="stat-card stat-time">
            <div className="stat-header">
              <ClockIcon className="stat-icon" />
              <h3 className="stat-label">Time Invested</h3>
            </div>
            <p className="stat-value">
              {summary.total_time_spent} min
            </p>
            <p className="stat-subtext">
              {Math.round(summary.total_time_spent / 60)} hours total
            </p>
          </div>

          <div className="stat-card stat-pace">
            <div className="stat-header">
              <ChartBarIcon className="stat-icon" />
              <h3 className="stat-label">Learning Pace</h3>
            </div>
            <p className="stat-value">
              {timeStats.length > 0 
                ? Math.round(timeStats.reduce((sum, stat) => sum + stat.minutes, 0) / timeStats.length)
                : 0} min/day
            </p>
            <p className="stat-subtext">
              Average over the last {days} days
            </p>
          </div>
        </div>
      )}

      <div className="charts-container">
        <div className="chart-wrapper">
          <div className="chart-container">
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>

        <div className="chart-wrapper">
          <div className="time-filter">
            <button
              type="button"
              onClick={() => handleDaysChange(7)}
              className={`time-button ${days === 7 ? 'selected' : ''}`}
            >
              7 days
            </button>
            <button
              type="button"
              onClick={() => handleDaysChange(14)}
              className={`time-button ${days === 14 ? 'selected' : ''}`}
            >
              14 days
            </button>
            <button
              type="button"
              onClick={() => handleDaysChange(30)}
              className={`time-button ${days === 30 ? 'selected' : ''}`}
            >
              30 days
            </button>
          </div>
          <div className="chart-container">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      </div>

      {!summary && pathId && (
        <div className="stats-empty">
          No progress data available for this learning path.
        </div>
      )}
    </div>
  );
}
