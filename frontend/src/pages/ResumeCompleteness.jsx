import { useEffect, useState } from 'react';
import { DocumentTextIcon, CheckCircleIcon, ExclamationCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import learningService from '../api/learningService';

const SECTION_KEYS = [
  { key: 'personal_info', label: 'Personal Info' },
  { key: 'work_experience', label: 'Work Experience' },
  { key: 'education', label: 'Education' },
  { key: 'skills', label: 'Skills' },
  { key: 'certifications', label: 'Certifications' },
  { key: 'projects', label: 'Projects' },
];

export default function ResumeCompleteness() {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResume = async () => {
      try {
        setLoading(true);
        const data = await learningService.getResumeData();
        setResume(data && data.length ? data[0] : data); // handle array or object
        setLoading(false);
      } catch (err) {
        setError('Failed to load resume data.');
        setLoading(false);
      }
    };
    fetchResume();
  }, []);

  // Determine completeness for each section
  const sections = SECTION_KEYS.map(({ key, label }) => {
    let complete = false;
    if (!resume) return { name: label, complete: false };
    switch (key) {
      case 'personal_info':
        complete = Boolean(resume.user && (resume.user.first_name || resume.user.last_name || resume.user.email));
        break;
      case 'work_experience':
        complete = Array.isArray(resume.work_experience) && resume.work_experience.length > 0;
        break;
      case 'education':
        complete = Array.isArray(resume.education) && resume.education.length > 0;
        break;
      case 'skills':
        complete = Array.isArray(resume.skills) && resume.skills.length > 0;
        break;
      case 'certifications':
        complete = Array.isArray(resume.certifications) && resume.certifications.length > 0;
        break;
      case 'projects':
        complete = Array.isArray(resume.projects) && resume.projects.length > 0;
        break;
      default:
        complete = false;
    }
    return { name: label, complete };
  });

  const completed = sections.filter(s => s.complete).length;
  const percent = Math.round((completed / sections.length) * 100);

  if (loading) {
    return (
      <div className="loading-container">
        <ArrowPathIcon className="loading-icon" />
        <div className="loading-text">Loading resume completeness...</div>
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
    <div className="resume-container">
      <h1 className="resume-heading">
        <DocumentTextIcon className="resume-icon" /> Resume Completeness
      </h1>
      <p className="resume-description">See how complete your resume is and get tips to improve it.</p>
      <div className="resume-summary">
        <div className="progress-circle-container">
          <svg className="progress-circle" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="10" />
            <circle
              cx="50" cy="50" r="45" fill="none"
              stroke="#22c55e" strokeWidth="10"
              strokeDasharray={2 * Math.PI * 45}
              strokeDashoffset={2 * Math.PI * 45 * (1 - percent / 100)}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.5s' }}
            />
            <text x="50" y="55" textAnchor="middle" fontSize="2em" fill="#22c55e" fontWeight="bold">{percent}%</text>
          </svg>
        </div>
        <div>
          <div className="resume-percent">{percent}% Complete</div>
          <ul className="resume-section-list">
            {sections.map((section) => (
              <li key={section.name} className="resume-section-item">
                {section.complete ? (
                  <CheckCircleIcon className="section-complete-icon" />
                ) : (
                  <ExclamationCircleIcon className="section-incomplete-icon" />
                )}
                <span className={section.complete ? 'section-complete-text' : 'section-incomplete-text'}>{section.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="resume-suggestions">
        <div className="suggestions-title">Suggestions to improve your resume:</div>
        <ul className="suggestions-list">
          {sections.filter(s => !s.complete).map(s => (
            <li key={s.name}>Add or update your <span className="font-medium">{s.name}</span> section.</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
