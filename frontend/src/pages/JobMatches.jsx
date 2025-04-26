import { useEffect, useState } from 'react';
import { BriefcaseIcon, CheckCircleIcon, ArrowPathIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import learningService from '../api/learningService';

export default function JobMatches() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const data = await learningService.getJobMatches();
        // Map backend job fields to UI fields
        const mapped = (data || []).map(job => ({
          title: job.title,
          company: job.company,
          logo: job.company_logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company || 'J')}&background=8B5CF6&color=fff`,
          match: Math.round(job.match_percentage || 0),
          location: job.location || 'Remote',
        }));
        setJobs(mapped);
        setLoading(false);
      } catch (err) {
        setError('Failed to load job matches.');
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <ArrowPathIcon className="loading-icon" />
        <div className="loading-text">Loading job matches...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <ExclamationCircleIcon className="error-icon" />
        <div className="error-text">{error}</div>
      </div>
    );
  }

  return (
    <div className="job-matches-container">
      <h1 className="job-matches-heading">
        <BriefcaseIcon className="briefcase-icon" /> Job Matches
      </h1>
      <p className="job-matches-description">Explore jobs that match your skills and interests.</p>
      <div className="summary-container">
        <div>
          <div className="total-jobs">{jobs.length}</div>
          <div className="summary-text">Jobs Matched</div>
        </div>
        <div>
          <div className="top-match">{jobs.length > 0 ? Math.max(...jobs.map(j => j.match)) : 0}%</div>
          <div className="summary-text">Top Match</div>
        </div>
      </div>
      {jobs.length === 0 ? (
        <div className="no-jobs-text">No job matches found. Update your skills to see more opportunities!</div>
      ) : (
        <div className="jobs-list">
          {jobs.map((job) => (
            <div key={job.title + job.company} className="job-card">
              <img src={job.logo} alt={job.company} className="job-logo" />
              <div className="job-info">
                <div className="job-title-row">
                  <span className="job-title">{job.title}</span>
                  <span className="job-location">{job.location}</span>
                </div>
                <div className="job-company">{job.company}</div>
              </div>
              <div className="job-match">
                <span className="match-percentage">
                  <CheckCircleIcon className="match-icon" /> {job.match}%
                </span>
                <span className="match-label">Match</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 