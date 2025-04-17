import React, { useContext, useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import axios from 'axios';
import { API_URL } from '../../config';

const AdminDashboard = () => {
    const { currentUser } = useContext(AuthContext);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalDoctors: 0,
        totalUsers: 0,
        totalAppointments: 0
    });
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

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };
    
                const [appointmentsRes, usersRes, doctorsRes] = await Promise.all([
                    axios.get(`${API_URL}/api/admin/appointments`, config),
                    axios.get(`${API_URL}/api/admin/users`, config),
                    axios.get(`${API_URL}/api/admin/doctors`, config)
                ]);
    
                const appointmentsData = appointmentsRes.data;
                const usersData = usersRes.data;
                const doctorsData = doctorsRes.data;

                console.log(appointmentsData.length)
    
                setAppointments(appointmentsData);
                setStats({
                    totalAppointments: appointmentsData.length,
                    totalUsers: usersData.length,
                    totalDoctors: doctorsData.length
                });
    
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchStats();
    }, []);
    
    const upcomingAppointments = appointments
        .filter(appointment => appointment.status === 'pending' || appointment.status === 'approved')
        .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
        .slice(0, 3);

    return (
        <Container className="py-4">
            <h2 className="mb-4">Welcome, {currentUser?.name} (Admin)</h2>

            {/* Quick Stats Cards */}
            <Row className="mb-4">
                <Col md={4}>
                    <Card className="stat-card patients-card">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <Card.Title>Total Doctor</Card.Title>
                                    <h2>{stats.totalDoctors}</h2>
                                </div>
                                <div className="stat-icon">
                                    <i className="fas fa-user-friends"></i>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4}>
                    <Card className="stat-card appointments-card">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <Card.Title>Total Users</Card.Title>
                                    <h2>{stats.totalUsers}</h2>
                                </div>
                                <div className="stat-icon">
                                    <i className="fas fa-calendar-check"></i>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4}>
                    <Card className="stat-card prescriptions-card">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <Card.Title>Total Appointments</Card.Title>
                                    <h2>{stats.totalAppointments}</h2>
                                </div>
                                <div className="stat-icon">
                                    <i className="fas fa-prescription-bottle-alt"></i>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="mb-4">
                <Col md={4}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title>Manage Doctors</Card.Title>
                            <Card.Text>View, add, or update doctor details.</Card.Text>
                            <Button as={Link} to="/admin/doctors" variant="primary" className="w-100">
                                Go to Doctors
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title>Manage Users</Card.Title>
                            <Card.Text>View and manage patient/user accounts.</Card.Text>
                            <Button as={Link} to="/admin/users" variant="primary" className="w-100">
                                Go to Users
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title>All Appointments</Card.Title>
                            <Card.Text>View and manage all appointments.</Card.Text>
                            <Button as={Link} to="/admin/appointments" variant="primary" className="w-100">
                                View Appointments
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <h4 className="mb-3">Upcoming Appointments</h4>
            {loading ? (
                <Spinner animation="border" />
            ) : upcomingAppointments.length === 0 ? (
                <p>No upcoming appointments.</p>
            ) : (
                <Row>
                    {upcomingAppointments.map((appt) => (
                        <Col md={4} key={appt._id} className="mb-3">
                            <Card className="border-left-primary shadow-sm h-100">
                                <Card.Body>
                                    <Card.Title>{appt.patientName}</Card.Title>
                                    <Card.Text>
                                        <strong>Date:</strong> {new Date(appt.appointmentDate).toLocaleDateString()}<br />
                                        <strong>Time:</strong> {appt.appointmentTime}<br />
                                        <strong>Status:</strong> {appt.status}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
};

export default AdminDashboard;
