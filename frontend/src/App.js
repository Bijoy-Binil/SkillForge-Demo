import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Container } from 'react-bootstrap';
import Navigation from './components/Navigation';
import AdminDashboard from './components/admin/AdminDashboard';
import ContentManagement from './components/admin/ContentManagement';
import ResumeBuilder from './components/ResumeBuilder';

function App() {
    const menuItems = [
        {
            title: 'Resume Builder',
            path: '/resume-builder',
            component: ResumeBuilder,
            icon: 'file-text'
        },
        {
            title: 'Admin Dashboard',
            path: '/admin/dashboard',
            component: AdminDashboard,
            icon: 'dashboard',
            adminOnly: true
        },
        {
            title: 'Content Management',
            path: '/admin/content',
            component: ContentManagement,
            icon: 'book',
            adminOnly: true
        }
    ];

    return (
        <Router>
            <Navigation menuItems={menuItems} />
            <Container className="mt-4">
                <Routes>
                    {menuItems.map((item) => (
                        <Route
                            key={item.path}
                            path={item.path}
                            element={
                                item.adminOnly && !isAdmin ? (
                                    <Navigate to="/" replace />
                                ) : (
                                    <item.component />
                                )
                            }
                        />
                    ))}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </Container>
            <ToastContainer />
        </Router>
    );
}

export default App; 