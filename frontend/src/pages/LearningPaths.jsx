import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AcademicCapIcon,
  BookOpenIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

// Mock data, in a real app this would come from an API
const mockLearningPaths = [
  {
    id: 1,
    title: 'Frontend Web Development',
    description: 'Learn HTML, CSS, JavaScript, and React to build modern web applications.',
    skillCount: 15,
    estimatedHours: 80,
    enrolled: true,
    progress: 65,
    creator: {
      name: 'John Smith',
      role: 'Senior Frontend Developer'
    }
  },
  {
    id: 2,
    title: 'Data Science Fundamentals',
    description: 'Master the basics of data science, including statistics, Python, and machine learning.',
    skillCount: 12,
    estimatedHours: 60,
    enrolled: true,
    progress: 25,
    creator: {
      name: 'Sarah Johnson',
      role: 'Data Scientist'
    }
  },
  {
    id: 3,
    title: 'Machine Learning Engineer',
    description: 'Learn the fundamentals of machine learning and AI.',
    skillCount: 8,
    estimatedHours: 40,
    enrolled: false,
    creator: {
      name: 'Michael Chen',
      role: 'ML Engineer'
    }
  },
  {
    id: 4,
    title: 'Full Stack JavaScript',
    description: 'Master Node.js, React, and related technologies.',
    skillCount: 12,
    estimatedHours: 60,
    enrolled: false,
    creator: {
      name: 'Lisa Wang',
      role: 'Full Stack Developer'
    }
  },
];

export default function LearningPaths() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // all, enrolled, created

  const filteredPaths = mockLearningPaths.filter(path => {
    const matchesSearch = path.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         path.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'enrolled') return matchesSearch && path.enrolled;
    if (filter === 'created') return matchesSearch && path.creator.name === 'John Smith'; // Just for demo
    
    return matchesSearch;
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Learning Paths</h1>
        <p className="mt-2 text-md text-gray-700">
          Discover curated learning paths to help you achieve your career goals.
        </p>
      </div>

      {/* Filters and search */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md ${
              filter === 'all'
                ? 'bg-primary-100 text-primary-700 font-medium'
                : 'bg-white text-gray-500 hover:bg-gray-50'
            }`}
          >
            All Paths
          </button>
          <button
            onClick={() => setFilter('enrolled')}
            className={`px-4 py-2 rounded-md ${
              filter === 'enrolled'
                ? 'bg-primary-100 text-primary-700 font-medium'
                : 'bg-white text-gray-500 hover:bg-gray-50'
            }`}
          >
            Enrolled
          </button>
          <button
            onClick={() => setFilter('created')}
            className={`px-4 py-2 rounded-md ${
              filter === 'created'
                ? 'bg-primary-100 text-primary-700 font-medium'
                : 'bg-white text-gray-500 hover:bg-gray-50'
            }`}
          >
            Created by Me
          </button>
        </div>
        <div className="flex">
          <div className="relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 pl-10 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
              placeholder="Search paths..."
            />
          </div>
          <Link
            to="/learning/create"
            className="ml-4 btn btn-primary inline-flex items-center"
          >
            <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Create Path
          </Link>
        </div>
      </div>

      {/* Learning paths grid */}
      {filteredPaths.length === 0 ? (
        <div className="text-center py-12">
          <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No learning paths found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filters to find what you're looking for.
          </p>
          <div className="mt-6">
            <Link
              to="/learning/create"
              className="btn btn-primary inline-flex items-center"
            >
              <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              Create a learning path
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {filteredPaths.map((path) => (
            <div
              key={path.id}
              className="card overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col h-full">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    <Link to={`/learning/${path.id}`} className="hover:text-primary-600">
                      {path.title}
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{path.description}</p>
                  
                  <div className="mt-3 flex items-center text-sm text-gray-500">
                    <BookOpenIcon className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" aria-hidden="true" />
                    <span>{path.skillCount} skills</span>
                    <span className="mx-2">•</span>
                    <ClockIcon className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" aria-hidden="true" />
                    <span>~{path.estimatedHours} hours</span>
                  </div>
                  
                  <div className="mt-3 text-sm">
                    <span className="text-gray-500">Created by </span>
                    <span className="font-medium text-gray-900">{path.creator.name}</span>
                    <span className="text-gray-500"> · {path.creator.role}</span>
                  </div>
                </div>
                
                {path.enrolled && (
                  <div className="mt-5">
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-medium text-gray-900">Progress</div>
                      <div className="text-sm font-medium text-gray-500">{path.progress}%</div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${path.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                <div className="mt-5 flex justify-end">
                  {path.enrolled ? (
                    <Link
                      to={`/learning/${path.id}`}
                      className="btn btn-primary"
                    >
                      Continue Learning
                    </Link>
                  ) : (
                    <Link
                      to={`/learning/${path.id}`}
                      className="btn btn-secondary"
                    >
                      View Details
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 