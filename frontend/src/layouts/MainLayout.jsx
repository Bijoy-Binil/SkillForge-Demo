import { Fragment, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Dialog, Menu, Transition } from '@headlessui/react';
import { 
  Bars3Icon, XMarkIcon, UserCircleIcon, AcademicCapIcon,
  HomeIcon, BookOpenIcon, BriefcaseIcon, DocumentTextIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import './MainLayout.css';

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Learning Paths', href: '/learning', icon: AcademicCapIcon },
    { name: 'Skills', href: '/skills', icon: BookOpenIcon },
    { name: 'Job Matches', href: '/jobs', icon: BriefcaseIcon },
    { name: 'Resume', href: '/resume', icon: DocumentTextIcon },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}