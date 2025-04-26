import { useEffect, useState } from 'react';
import { BookOpenIcon, ClockIcon, ArrowPathIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import learningService from '../api/learningService';

export default function SkillsInProgress() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        const enrolled = await learningService.getMyEnrolledPaths();
        // Map enrolled paths to skill-like objects
        const mapped = (enrolled || []).map(path => ({
          name: path.title,
          progress: Math.round(path.progress_percentage || 0),
          hours: path.estimated_hours || 0,
        }));
        setSkills(mapped);
        setLoading(false);
      } catch (err) {
        setError('Failed to load skills in progress.');
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const totalSkills = skills.length;
  const avgProgress = totalSkills > 0 ? Math.round(skills.reduce((acc, s) => acc + s.progress, 0) / totalSkills) : 0;

  if (loading) {
    return (
      <div className="loading-container">
        <ArrowPathIcon className="loading-icon" />
        <div className="loading-text">Loading your skills in progress...</div>
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
    <div className="skills-container">
      <h1 className="skills-heading">
        <BookOpenIcon className="book-icon" /> Skills in Progress
      </h1>
      <p className="skills-description">Track your progress on the skills you are currently learning.</p>
      <div className="summary-container">
        <div>
          <div className="total-skills">{totalSkills}</div>
          <div className="summary-text">Skills in Progress</div>
        </div>
        <div>
          <div className="avg-progress">{avgProgress}%</div>
          <div className="summary-text">Average Completion</div>
        </div>
      </div>
      {skills.length === 0 ? (
        <div className="no-skills-text">You have no skills in progress yet. Enroll in a learning path to get started!</div>
      ) : (
        <div className="skills-list">
          {skills.map((skill) => (
            <div key={skill.name} className="skill-card">
              <div className="skill-header">
                <span className="skill-name">{skill.name}</span>
                <span className="skill-hours">
                  <ClockIcon className="clock-icon" /> {skill.hours} hrs
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress"
                  style={{ width: `${skill.progress}%` }}
                ></div>
              </div>
              <div className="progress-text">{skill.progress}% complete</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
