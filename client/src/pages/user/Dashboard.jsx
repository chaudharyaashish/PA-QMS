import React, {useContext, useState, useEffect} from 'react';
import {Container, Row, Col, Card, Button} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {AuthContext} from '../../context/AuthContext';
import axios from 'axios';
import {API_URL} from '../../config';

const Dashboard = () => {
    const {currentUser} = useContext(AuthContext);
    const [appointments, setAppointments] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [queuePosition, setQueuePosition] = useState(null);
    const [estimatedTime, setEstimatedTime] = useState(null);
    const [loading, setLoading] = useState(true);
    const [queueLoading, setQueueLoading] = useState(true);
    const [todayAppointments, setTodayAppointments] = useState([]);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {Authorization: `Bearer ${token}`}
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

    useEffect(() => {
        fetchTodayAppointments();
    }, []);

    const fetchTodayAppointments = async () => {
        try {
            const response = await axios.get(API_URL + '/api/appointments/today', {
                headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
            });
            console.log(response.data.appointments);
            setTodayAppointments(response.data.appointments);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching appointments');
            setLoading(false);
        }
    };

    const upcomingAppointments = appointments
        .filter(app => app.status === 'pending' || app.status === 'approved')
        .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
        .slice(0, 3);

    return (
        <Container>
            <h2 className="mb-4">Welcome, {currentUser?.name}!</h2>
            <Row>
                {/* Left Column */}
                <Col md={8}>
                    {/* Upcoming Appointments */}
                    <Card className="mb-4 shadow-sm">
                        <Card.Body>
                            <Card.Title>Upcoming Appointments</Card.Title>
                            {loading ? (
                                <div className="text-center my-4">
                                    <div className="spinner-border text-primary" role="status"/>
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
                                                {upcomingAppointments.map(app => (
                                                    <tr key={app.id}>
                                                        <td>{app.Doctor?.User?.name}</td>
                                                        <td>{new Date(app.appointmentDate).toLocaleDateString()}</td>
                                                        <td>{app.appointmentTime}</td>
                                                        <td>
                                                                <span
                                                                    className={`badge ${app.status === 'approved' ? 'bg-success' : 'bg-warning'}`}>
                                                                    {app.status}
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

                    {/* Book Appointment + Prescriptions */}
                    <Row>
                        <Col md={6}>
                            <Card className="mb-4 shadow-sm">
                                <Card.Body className="text-center">
                                    <div className="mb-3">
                                        <i className="bi bi-calendar-plus"
                                           style={{fontSize: '2.5rem', color: '#0d6efd'}}></i>
                                    </div>
                                    <Card.Title>Book Appointment</Card.Title>
                                    <Card.Text>Schedule a new appointment with a doctor.</Card.Text>
                                    <Link to="/user/book-appointment">
                                        <Button variant="primary">Book Now</Button>
                                    </Link>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6}>
                            <Card className="mb-4 shadow-sm">
                                <Card.Body>
                                    <Card.Title>Recent Prescriptions</Card.Title>
                                    {prescriptions.length > 0 ? (
                                        <ul className="list-group">
                                            {prescriptions.slice(0, 3).map((pres, index) => (
                                                <li className="list-group-item" key={index}>
                                                    <strong>Doctor:</strong> {pres.Doctor?.User?.name || 'N/A'}<br/>
                                                    <strong>Date:</strong> {new Date(pres.createdAt).toLocaleDateString()}<br/>
                                                    <strong>Notes:</strong> {pres.prescriptionText}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>No prescriptions available.</p>
                                    )}
                                    <div className="mt-3 text-center">
                                        <Link to="/user/prescriptions">
                                            <Button variant="outline-secondary">View All</Button>
                                        </Link>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>

                {/* Right Column */}
                <Col md={4}>
                    {/* Live Queue Status */}
                    <Card className="mb-4 shadow-sm">
                        <Card.Body>
                            <Card.Title>Live Queue Status</Card.Title>
                            <div className="mt-4">

                                        <p><strong>Current Queue Position:</strong> {queuePosition}</p>
                            </div>
                            <div className="mt-3 text-center">
                                <Link to={'/self-check-in'}>
                                    <Button variant="success">Self Check-In</Button>
                                </Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Dashboard;
