import React, { useContext, useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import axios from 'axios';
import { API_URL } from '../../config';

const AdminDashboard = () => {
    const { currentUser } = useContext(AuthContext);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };

                const response = await axios.get(`${API_URL}/api/appointments`, config);
                setAppointments(response.data);
            } catch (error) {
                console.error('Error fetching appointments:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    // Get upcoming appointments (limit to 3)
    const upcomingAppointments = appointments
        .filter(appointment => appointment.status === 'pending' || appointment.status === 'approved')
        .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
        .slice(0, 3);

    return (
        <Container>
            <h2 className="mb-4">Welcome, {currentUser?.name}!</h2>

            <Row>

                <Col md={4}>
                    <Card className="mb-4 shadow-sm">
                        <Card.Body>
                            <Card.Title>User Information</Card.Title>
                            <div className="mt-4">
                                <p><strong>Name:</strong> {currentUser?.name}</p>
                                <p><strong>Email:</strong> {currentUser?.email}</p>
                                <p><strong>Phone:</strong> {currentUser?.phone || 'Not provided'}</p>
                                <p><strong>Address:</strong> {currentUser?.address || 'Not provided'}</p>
                            </div>
                            <div className="mt-4 text-center">
                                <Link to="/user/profile">
                                    <Button variant="outline-secondary">Update Profile</Button>
                                </Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AdminDashboard;