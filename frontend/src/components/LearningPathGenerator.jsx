import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import learningService from '../api/learningService';
import { 
  SparklesIcon, 
  ClockIcon, 
  AcademicCapIcon,
  ArrowPathIcon 
} from '@heroicons/react/24/outline';
import './LearningPathGenerator.css';

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
  // ... keep all existing logic and state ...

  return (
    <div className="generator-container">
      <div className="generator-header">
        <SparklesIcon className="generator-icon" />
        <h2 className="generator-title">AI Learning Path Generator</h2>
      </div>
      
      <p className="generator-description">
        Enter your learning goal, and our AI will create a personalized learning path with curated resources.
      </p>
      
      {error && (
        <div className="error-alert">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="generator-form">
        <div className="form-group">
          <label htmlFor="goal" className="form-label">
            What would you like to learn?
          </label>
          <input
            type="text"
            id="goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="e.g., Frontend Developer, Data Science, Cloud Engineering"
            className="form-input"
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">
            Suggestions:
          </label>
          <div className="suggestions-container">
            {GOAL_SUGGESTIONS.map(suggestion => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className="suggestion-button"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="duration" className="form-label">
            Duration
          </label>
          <div className="duration-selector">
            <select
              id="duration"
              value={durationWeeks}
              onChange={(e) => setDurationWeeks(Number(e.target.value))}
              className="duration-input"
              disabled={loading}
            >
              <option value={1}>1 week</option>
              <option value={2}>2 weeks</option>
              <option value={4}>4 weeks</option>
              <option value={8}>8 weeks</option>
              <option value={12}>12 weeks</option>
            </select>
            <ClockIcon className="duration-icon" />
          </div>
        </div>
        
        <div className="submit-group">
          <button
            type="submit"
            disabled={loading}
            className="submit-button"
          >
            {loading ? (
              <>
                <ArrowPathIcon className="spinner" />
                Generating your learning path...
              </>
            ) : (
              <>
                <AcademicCapIcon className="submit-icon" />
                Generate Learning Path
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}