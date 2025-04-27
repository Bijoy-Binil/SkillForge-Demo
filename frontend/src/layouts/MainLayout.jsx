import { Fragment, useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Dialog, Menu, Transition } from '@headlessui/react';
import { 
  Bars3Icon, XMarkIcon, UserCircleIcon, AcademicCapIcon,
  HomeIcon, BookOpenIcon, BriefcaseIcon, DocumentTextIcon,
  ArrowRightOnRectangleIcon, CodeBracketIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import './MainLayout.css';
import ResumeBuilder from '../components/ResumeBuilder';
import ProgressStats from '../components/ProgressStats';
import ModuleProgress from '../components/ModuleProgress';
import LearningPathGenerator from '../components/LearningPathGenerator';
import AdminDashboard from '../components/admin/AdminDashboard';

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showResumeBuilder, setShowResumeBuilder] = useState(false);
  const [showProgressStats, setShowProgressStats] = useState(false);
  const [showModuleProgress, setShowModuleProgress] = useState(false);
  const [showLearningPathGenerator, setShowLearningPathGenerator] = useState(false);
  const [enrolledPaths, setEnrolledPaths] = useState([]);
  const [selectedPathId, setSelectedPathId] = useState('');
  const [modules, setModules] = useState([]);
  const [selectedModuleId, setSelectedModuleId] = useState('');

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Learning Paths', href: '/learning', icon: AcademicCapIcon },
    { name: 'Skills', href: '/skills', icon: BookOpenIcon },
    { name: 'Job Matches', href: '/jobs', icon: BriefcaseIcon },
    { name: 'Resume', href: '/resume', icon: DocumentTextIcon },
    { name: 'GitHub Analysis', href: '/github-analysis', icon: CodeBracketIcon },
    { name: 'Language Charts', href: '/language-charts', icon: BookOpenIcon },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Fetch enrolled paths on mount
  useEffect(() => {
    if (showModuleProgress) {
      import('../api/learningService').then(({ default: learningService }) => {
        learningService.getMyEnrolledPaths().then(setEnrolledPaths);
      });
    }
  }, [showModuleProgress]);

  // Fetch modules when a path is selected
  useEffect(() => {
    if (selectedPathId) {
      import('../api/learningService').then(({ default: learningService }) => {
        learningService.getModulesByPath(selectedPathId).then(setModules);
      });
    } else {
      setModules([]);
      setSelectedModuleId('');
    }
  }, [selectedPathId]);

  return (
    <div className="layout-container">
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="mobile-sidebar-overlay" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="overlay-enter"
            leave="overlay-leave"
          >
            <div className="overlay-background" />
          </Transition.Child>

          <div className="mobile-sidebar-container">
            <Transition.Child
              as={Fragment}
              enter="sidebar-enter"
              leave="sidebar-leave"
            >
              <Dialog.Panel className="mobile-sidebar-panel">
                <Transition.Child
                  as={Fragment}
                  enter="close-button-enter"
                  leave="close-button-leave"
                >
                  <div className="mobile-sidebar-close">
                    <button type="button" onClick={() => setSidebarOpen(false)}>
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon className="close-icon" />
                    </button>
                  </div>
                </Transition.Child>
                <div className="mobile-sidebar-content">
                  <div className="sidebar-logo">
                    <Link to="/">
                      <AcademicCapIcon className="logo-icon" />
                      <span className="logo-text">SkillForge</span>
                    </Link>
                  </div>
                  <nav className="sidebar-nav">
                    <ul className="nav-list">
                      {navigation.map((item) => (
                        <li key={item.name}>
                          <Link to={item.href} className="nav-link">
                            <item.icon className="nav-icon" />
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop sidebar */}
      <div className="desktop-sidebar">
        <div className="sidebar-content">
          <div className="sidebar-logo">
            <Link to="/">
              <AcademicCapIcon className="logo-icon" />
              <span className="logo-text">SkillForge</span>
            </Link>
          </div>
          <nav className="sidebar-nav">
            <ul className="nav-list">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link to={item.href} className="nav-link">
                    <item.icon className="nav-icon" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div className="main-content">
        <div className="top-navbar">
          <button 
            type="button" 
            className="mobile-menu-button"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="menu-icon" />
          </button>

          <div className="user-menu-container">
            <Menu as="div" className="user-menu">
              <Menu.Button className="user-menu-button">
                {user?.profile_image ? (
                  <img
                    className="user-avatar"
                    src={user.profile_image}
                    alt="User profile"
                  />
                ) : (
                  <UserCircleIcon className="default-avatar" />
                )}
                <span className="user-name">
                  {user ? `${user.first_name} ${user.last_name}` : 'Loading...'}
                </span>
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="menu-enter"
                leave="menu-leave"
              >
                <Menu.Items className="dropdown-menu">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/profile"
                        className={`dropdown-item ${active ? 'active' : ''}`}
                      >
                        Your profile
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={`dropdown-item ${active ? 'active' : ''}`}
                      >
                        <ArrowRightOnRectangleIcon className="logout-icon" />
                        Sign out
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>

        <main className="content-area">
          <div className="content-container">
            {user && (user.is_staff || user.is_superuser) && (
              <div className="mb-4">
                <AdminDashboard />
              </div>
            )}
            <button
              className="btn btn-primary mb-4"
              onClick={() => setShowResumeBuilder((prev) => !prev)}
            >
              {showResumeBuilder ? 'Hide AI Resume Builder' : 'Show AI Resume Builder'}
            </button>
            {showResumeBuilder && <ResumeBuilder />}
            <button
              className="btn btn-secondary mb-4"
              onClick={() => setShowProgressStats((prev) => !prev)}
            >
              {showProgressStats ? 'Hide Progress Stats' : 'Show Progress Stats'}
            </button>
            {showProgressStats && <ProgressStats />}
            <button
              className="btn btn-secondary mb-4"
              onClick={() => setShowModuleProgress((prev) => !prev)}
            >
              {showModuleProgress ? 'Hide Module Progress' : 'Show Module Progress'}
            </button>
            {showModuleProgress && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-4 mb-2">
                  <select
                    className="form-select"
                    value={selectedPathId}
                    onChange={e => setSelectedPathId(e.target.value)}
                  >
                    <option value="">Select Learning Path</option>
                    {enrolledPaths.map(path => (
                      <option key={path.id} value={path.id}>{path.title}</option>
                    ))}
                  </select>
                  <select
                    className="form-select"
                    value={selectedModuleId}
                    onChange={e => setSelectedModuleId(e.target.value)}
                    disabled={!selectedPathId}
                  >
                    <option value="">Select Module</option>
                    {modules.map(module => (
                      <option key={module.id} value={module.id}>{module.title}</option>
                    ))}
                  </select>
                </div>
                {selectedPathId && selectedModuleId && (
                  <ModuleProgress moduleId={selectedModuleId} pathId={selectedPathId} />
                )}
              </div>
            )}
            <button
              className="btn btn-secondary mb-4"
              onClick={() => setShowLearningPathGenerator((prev) => !prev)}
            >
              {showLearningPathGenerator ? 'Hide AI Learning Path Generator' : 'Show AI Learning Path Generator'}
            </button>
            {showLearningPathGenerator && <LearningPathGenerator />}
            <Outlet />
            
          </div>
        </main>
      </div>
    </div>
  );
}