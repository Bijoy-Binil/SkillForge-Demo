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
  // ... keep all existing logic and state ...

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