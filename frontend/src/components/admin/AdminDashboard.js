import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import './AdminDashboard.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const AdminDashboard = () => {
    // ... keep all state and logic the same ...

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    if (error) {
        return <div className="error-alert">{error}</div>;
    }

    return (
        <div className="admin-dashboard">
            <h2 className="dashboard-title">Admin Dashboard</h2>
            
            <div className="metrics-grid">
                <div className="metric-card">
                    <h3 className="metric-title">Total Users</h3>
                    <div className="metric-value">{metrics.total_users}</div>
                    <div className="badge success">Active: {metrics.active_users}</div>
                </div>
                
                <div className="metric-card">
                    <h3 className="metric-title">Learning Paths</h3>
                    <div className="metric-value">{metrics.total_learning_paths}</div>
                    <div className="badge info">Completed: {metrics.completed_paths}</div>
                </div>
                
                <div className="metric-card">
                    <h3 className="metric-title">Avg. Completion Time</h3>
                    <div className="metric-value">
                        {metrics.average_completion_time.toFixed(1)}h
                    </div>
                </div>
                
                <div className="metric-card">
                    <h3 className="metric-title">Popular Skills</h3>
                    <div className="skills-container">
                        {metrics.popular_skills.map((skill, index) => (
                            <div key={index} className="badge secondary">{skill}</div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="chart-card">
                <h4 className="chart-title">User Activity</h4>
                <div className="chart-container">
                    <Line data={activityData} />
                </div>
            </div>

            <div className="user-management-card">
                <h4 className="management-title">User Management</h4>
                {userLoading ? (
                    <div className="spinner"></div>
                ) : (
                    <div className="table-container">
                        <table className="user-table">
                            <thead>
                                <tr>
                                    <th>Email</th>
                                    <th>Name</th>
                                    <th>Joined</th>
                                    <th>Last Login</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.email}</td>
                                        <td>{`${user.first_name} ${user.last_name}`}</td>
                                        <td>{new Date(user.date_joined).toLocaleDateString()}</td>
                                        <td>{new Date(user.last_login).toLocaleDateString()}</td>
                                        <td>
                                            <div className={`badge ${user.is_active ? 'success' : 'danger'}`}>
                                                {user.is_active ? 'Active' : 'Inactive'}
                                            </div>
                                        </td>
                                        <td>
                                            <button
                                                className={`btn ${user.is_active ? 'danger' : 'success'}`}
                                                onClick={() => handleUserStatusChange(user.id, !user.is_active)}
                                            >
                                                {user.is_active ? 'Deactivate' : 'Activate'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;