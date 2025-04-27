import {
  AcademicCapIcon,
  BookOpenIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  ClockIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
// import './Dashboard.css'; // ← Make sure this matches your file path
import './Dashboard.css'
const stats = [
  { name: 'Learning Paths', value: '3', href: '/learning', icon: AcademicCapIcon },
  { name: 'Skills in Progress', value: '12', href: '/skills', icon: BookOpenIcon },
  { name: 'Job Matches', value: '8', href: '/jobs', icon: BriefcaseIcon },
  { name: 'Resume Completeness', value: '80%', href: '/resume', icon: DocumentTextIcon },
];

const activities = [
  { id: 1, type: 'skill_completed', skill: 'React Basics', path: 'Frontend Web Development', date: '3 days ago' },
  { id: 2, type: 'path_enrolled', path: 'Data Science Fundamentals', date: '1 week ago' },
  { id: 3, type: 'job_match', job: 'Frontend Developer', company: 'Tech Solutions', date: '2 weeks ago' },
];

const recommendedPaths = [
  {
    id: 1,
    title: 'Machine Learning Engineer',
    description: 'Learn the fundamentals of machine learning and AI.',
    skillCount: 8,
    estimatedHours: 40,
  },
  {
    id: 2,
    title: 'Full Stack JavaScript',
    description: 'Master Node.js, React, and related technologies.',
    skillCount: 12,
    estimatedHours: 60,
  },
];

export default function Dashboard() {
  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">
          Track your progress, view recommended learning paths, and see your latest activity.
        </p>
      </div>

      {/* Stats */}
      <div className="dashboard-stats">
        {stats.map((stat) => (
          <Link key={stat.name} to={stat.href} className="dashboard-card">
            <div className="dashboard-stat">
              <div className="dashboard-icon-container">
                <stat.icon className="dashboard-icon" aria-hidden="true" />
              </div>
              <div className="dashboard-stat-content">
                <dl>
                  <dt className="dashboard-stat-name">{stat.name}</dt>
                  <dd className="dashboard-stat-value">{stat.value}</dd>
                </dl>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="dashboard-grid">
        {/* Recent Activity */}
        <div>
          <div className="dashboard-section-header">
            <h2 className="dashboard-section-title">Recent Activity</h2>
            <ClockIcon className="dashboard-meta-icon" aria-hidden="true" />
          </div>
          <div className="dashboard-activity-list">
            <ul role="list">
              {activities.map((activity) => (
                <li key={activity.id} className="dashboard-activity-item">
                  <div className="dashboard-activity-icon-container">
                    {activity.type === 'skill_completed' && (
                      <div className="dashboard-activity-icon bg-green">
                        <BookOpenIcon className="dashboard-icon" aria-hidden="true" />
                      </div>
                    )}
                    {activity.type === 'path_enrolled' && (
                      <div className="dashboard-activity-icon bg-blue">
                        <AcademicCapIcon className="dashboard-icon" aria-hidden="true" />
                      </div>
                    )}
                    {activity.type === 'job_match' && (
                      <div className="dashboard-activity-icon bg-purple">
                        <BriefcaseIcon className="dashboard-icon" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                  <div className="dashboard-activity-text">
                    <p className="dashboard-activity-title">
                      {activity.type === 'skill_completed' && (
                        <>Completed <span className="font-semibold">{activity.skill}</span> in {activity.path}</>
                      )}
                      {activity.type === 'path_enrolled' && (
                        <>Enrolled in <span className="font-semibold">{activity.path}</span></>
                      )}
                      {activity.type === 'job_match' && (
                        <>New job match: <span className="font-semibold">{activity.job}</span> at {activity.company}</>
                      )}
                    </p>
                    <p className="dashboard-activity-date">{activity.date}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="dashboard-activity-footer">
              <Link to="/activity" className="dashboard-activity-link">
                View all activity
              </Link>
            </div>
          </div>
        </div>

        {/* Recommended Learning Paths */}
        <div>
          <div className="dashboard-section-header">
            <h2 className="dashboard-section-title">Recommended for You</h2>
            <ChartBarIcon className="dashboard-meta-icon" aria-hidden="true" />
          </div>
          <div className="dashboard-recommended-list">
            {recommendedPaths.map((path) => (
              <Link
                key={path.id}
                to={`/learning/${path.id}`}
                className="dashboard-path"
              >
                <h3 className="dashboard-path-title">{path.title}</h3>
                <p className="dashboard-path-desc">{path.description}</p>
                <div className="dashboard-path-meta">
                  <BookOpenIcon className="dashboard-meta-icon" aria-hidden="true" />
                  <span>{path.skillCount} skills</span>
                  <span className="dashboard-path-separator">•</span>
                  <ClockIcon className="dashboard-meta-icon" aria-hidden="true" />
                  <span>~{path.estimatedHours} hours</span>
                </div>
              </Link>
            ))}
            <div className="dashboard-discover-footer">
              <Link to="/learning/discover" className="btn-primary">
                Explore more learning paths
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
