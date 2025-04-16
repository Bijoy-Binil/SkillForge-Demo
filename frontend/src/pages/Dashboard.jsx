import { 
  AcademicCapIcon, 
  BookOpenIcon, 
  BriefcaseIcon, 
  DocumentTextIcon, 
  ClockIcon, 
  ChartBarIcon 
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

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
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h1>
        <p className="mt-2 text-md text-gray-700">
          Track your progress, view recommended learning paths, and see your latest activity.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            to={stat.href}
            className="card hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="h-10 w-10 text-primary-600" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                  <dd className="text-3xl font-semibold text-gray-900">{stat.value}</dd>
                </dl>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
            <ClockIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <div className="card overflow-hidden">
            <ul role="list" className="divide-y divide-gray-200">
              {activities.map((activity) => (
                <li key={activity.id} className="px-4 py-4 sm:px-0">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {activity.type === 'skill_completed' && (
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                          <BookOpenIcon className="h-5 w-5 text-green-600" aria-hidden="true" />
                        </div>
                      )}
                      {activity.type === 'path_enrolled' && (
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <AcademicCapIcon className="h-5 w-5 text-blue-600" aria-hidden="true" />
                        </div>
                      )}
                      {activity.type === 'job_match' && (
                        <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                          <BriefcaseIcon className="h-5 w-5 text-purple-600" aria-hidden="true" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">
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
                      <p className="text-sm text-gray-500">{activity.date}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="bg-gray-50 px-4 py-3 text-sm text-gray-700 flex justify-center">
              <Link to="/activity" className="font-medium text-primary-600 hover:text-primary-500">
                View all activity
              </Link>
            </div>
          </div>
        </div>

        {/* Recommended Learning Paths */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Recommended for You</h2>
            <ChartBarIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <div className="space-y-4">
            {recommendedPaths.map((path) => (
              <Link 
                key={path.id} 
                to={`/learning/${path.id}`}
                className="card block hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-base font-semibold text-gray-900">{path.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{path.description}</p>
                <div className="mt-3 flex items-center text-sm text-gray-500">
                  <BookOpenIcon className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" aria-hidden="true" />
                  <span>{path.skillCount} skills</span>
                  <span className="mx-2">•</span>
                  <ClockIcon className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" aria-hidden="true" />
                  <span>~{path.estimatedHours} hours</span>
                </div>
              </Link>
            ))}
            <div className="text-center">
              <Link
                to="/learning/discover"
                className="btn btn-primary inline-flex items-center"
              >
                Explore more learning paths
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 