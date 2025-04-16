import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Badge, Spinner, Alert } from 'react-bootstrap';
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
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]);
    const [userLoading, setUserLoading] = useState(true);

    useEffect(() => {
        fetchMetrics();
        fetchUsers();
    }, []);

    const fetchMetrics = async () => {
        try {
            const response = await axios.get('/api/admin/metrics/');
            setMetrics(response.data);
        } catch (err) {
            setError('Failed to load metrics');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/api/admin/users/');
            setUsers(response.data.results);
        } catch (err) {
            console.error(err);
        } finally {
            setUserLoading(false);
        }
    };

    const handleUserStatusChange = async (userId, isActive) => {
        try {
            await axios.patch(`/api/admin/users/${userId}/`, { is_active: isActive });
            fetchUsers();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    const activityData = {
        labels: ['Daily', 'Weekly', 'Monthly'],
        datasets: [
            {
                label: 'New Users',
                data: [
                    metrics.user_activity.daily.new_users,
                    metrics.user_activity.weekly.new_users,
                    metrics.user_activity.monthly.new_users
                ],
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            },
            {
                label: 'Active Users',
                data: [
                    metrics.user_activity.daily.active_users,
                    metrics.user_activity.weekly.active_users,
                    metrics.user_activity.monthly.active_users
                ],
                borderColor: 'rgb(53, 162, 235)',
                tension: 0.1
            }
        ]
    };

    return (
        <div className="admin-dashboard">
            <h2 className="mb-4">Admin Dashboard</h2>
            
            <Row className="mb-4">
                <Col md={3}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Total Users</Card.Title>
                            <Card.Text className="display-4">{metrics.total_users}</Card.Text>
                            <Badge bg="success">Active: {metrics.active_users}</Badge>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Learning Paths</Card.Title>
                            <Card.Text className="display-4">{metrics.total_learning_paths}</Card.Text>
                            <Badge bg="info">Completed: {metrics.completed_paths}</Badge>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Avg. Completion Time</Card.Title>
                            <Card.Text className="display-4">
                                {metrics.average_completion_time.toFixed(1)}h
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Popular Skills</Card.Title>
                            <div className="mt-2">
                                {metrics.popular_skills.map((skill, index) => (
                                    <Badge key={index} bg="secondary" className="me-2">
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Card className="mb-4">
                <Card.Header>
                    <h4>User Activity</h4>
                </Card.Header>
                <Card.Body>
                    <Line data={activityData} />
                </Card.Body>
            </Card>

            <Card>
                <Card.Header>
                    <h4>User Management</h4>
                </Card.Header>
                <Card.Body>
                    {userLoading ? (
                        <Spinner animation="border" />
                    ) : (
                        <Table striped hover>
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
                                            <Badge bg={user.is_active ? 'success' : 'danger'}>
                                                {user.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </td>
                                        <td>
                                            <button
                                                className={`btn btn-sm ${user.is_active ? 'btn-danger' : 'btn-success'}`}
                                                onClick={() => handleUserStatusChange(user.id, !user.is_active)}
                                            >
                                                {user.is_active ? 'Deactivate' : 'Activate'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
};

export default AdminDashboard; 