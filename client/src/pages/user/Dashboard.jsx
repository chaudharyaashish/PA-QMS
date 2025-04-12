import React, { useContext, useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { API_URL } from '../../config';

const UserDashboard = () => {
    const { currentUser } = useContext(AuthContext);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [queuePosition, setQueuePosition] = useState(null);
    const [estimatedTime, setEstimatedTime] = useState(null);
    const [queueLoading, setQueueLoading] = useState(true);

    // Fetch Appointments
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

    // Fetch Queue Status
    const refreshQueueStatus = async () => {
        setQueueLoading(true);
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            const response = await axios.get(`${API_URL}/api/queue/status`, config);
            setQueuePosition(response.data.position);
            setEstimatedTime(response.data.estimatedTime);
        } catch (error) {
            console.error("Failed to fetch queue status", error);
            setQueuePosition('Unavailable');
            setEstimatedTime('Unavailable');
        } finally {
            setQueueLoading(false);
        }
    };

    useEffect(() => {
        refreshQueueStatus();
    }, []);

    const upcomingAppointments = appointments
        .filter(appointment => appointment.status === 'pending' || appointment.status === 'approved')
        .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
        .slice(0, 3);

    return (
        <Container>
            <h2 className="mb-4">Welcome, {currentUser?.name}!</h2>

            <Row>
                <Col md={8}>
                    <Card className="mb-4 shadow-sm">
                        <Card.Body>
                            <Card.Title>Upcoming Appointments</Card.Title>
                            {loading ? (
                                <div className="text-center my-4">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {upcomingAppointments.length > 0 ? (
                                        <div className="table-responsive">
                                            <table className="table table-hover">
                                                <thead>
                                                    <tr>
                                                        <th>Doctor</th>
                                                        <th>Date</th>
                                                        <th>Time</th>
                                                        <th>Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {upcomingAppointments.map(appointment => (
                                                        <tr key={appointment.id}>
                                                            <td>{appointment.Doctor.User.name}</td>
                                                            <td>{new Date(appointment.appointmentDate).toLocaleDateString()}</td>
                                                            <td>{appointment.appointmentTime}</td>
                                                            <td>
                                                                <span className={`badge ${appointment.status === 'approved' ? 'bg-success' : 'bg-warning'}`}>
                                                                    {appointment.status}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <p className="text-center my-4">No upcoming appointments.</p>
                                    )}

                                    <div className="text-center mt-3">
                                        <Link to="/user/appointments">
                                            <Button variant="outline-primary">View All Appointments</Button>
                                        </Link>
                                    </div>
                                </>
                            )}
                        </Card.Body>
                    </Card>

                    <Row>
                        <Col md={6}>
                            <Card className="mb-4 shadow-sm">
                                <Card.Body className="text-center">
                                    <div className="mb-3">
                                        <i className="bi bi-calendar-plus" style={{ fontSize: '2.5rem', color: '#0d6efd' }}></i>
                                    </div>
                                    <Card.Title>Book Appointment</Card.Title>
                                    <Card.Text>Schedule a new appointment with a doctor.</Card.Text>
                                    <Link to="/user/book-appointment">
                                        <Button variant="primary">Book Now</Button>
                                    </Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>

                <Col md={4}>
                    <Card className="mb-4 shadow-sm">
                        <Card.Body>
                            <Card.Title>Live Queue Status</Card.Title>
                            <div className="mt-4">
                                {queueLoading ? (
                                    <div className="text-center">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <p><strong>Current Queue Position:</strong> {queuePosition}</p>
                                        <p><strong>Estimated Wait Time:</strong> {estimatedTime}</p>
                                    </>
                                )}
                            </div>
                            <div className="mt-4 text-center">
                                <Button variant="outline-primary" onClick={refreshQueueStatus}>
                                    Refresh Status
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default UserDashboard;
