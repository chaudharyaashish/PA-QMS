import React, {useContext, useEffect, useState} from "react";
import {Button, Card, Col, Container, Row, Spinner, Table} from "react-bootstrap";
import {Link} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";
import "./DoctorDashboard.css";
import axios from 'axios';
import {API_URL} from '../../config';

const DoctorDashboard = () => {
    const {currentUser} = useContext(AuthContext);
    console.log(currentUser)
    const [appointments, setAppointments] = useState([]);
    const [doctor, setDoctor] = useState();
    const [stats, setStats] = useState({
        totalPatients: 0,
        todayAppointments: 0,
        prescriptions: 0
    });

    const [error, setError] = useState(null);
    const [updating, setUpdating] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAppointments();
        fetchPrescriptions()
    }, []);

    useEffect(() => {
        const fetchDoctor = async () => {

            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };

                const response = await axios.get(`${API_URL}/api/doctors/me`, config);
                console.log(response.data)
                setDoctor(response.data);
            } catch (err) {
                console.error('Error fetching profile:', err);
                setError('Failed to load profile');
            } finally {
                setLoading(false);
            }
        }

        fetchDoctor()
    }, [])

    const fetchAppointments = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const response = await axios.get(`${API_URL}/api/doctors/appointments`, config);
            const appts = response.data;

            // Calculate stats
            const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
            const uniquePatients = new Set();
            let todayCount = 0;
            let prescriptionCount = 0;

            appts.forEach(appt => {
                if (appt.User?.id) {
                    uniquePatients.add(appt.User.id);
                }
                if (appt.appointmentDate === today) {
                    todayCount++;
                }
                if (appt.prescription) {
                    prescriptionCount++;
                }
            });

            setAppointments(appts);
            setStats({
                totalPatients: uniquePatients.size,
                todayAppointments: todayCount,
                prescriptions: prescriptionCount
            });
        } catch (err) {
            console.error('Error fetching appointments:', err);
            setError('Failed to load appointments');
        } finally {
            setLoading(false);
        }
    };

    const fetchPrescriptions = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.get(`${API_URL}/api/prescriptions/doctors`, config);
            setStats(prevStats => ({
                ...prevStats,
                prescriptions: response.data.length,
            }));

        } catch (err) {
            console.error('Error fetching prescriptions:', err);
        }
    };

    const updateStatus = async (appointmentId, newStatus) => {
        setUpdating(appointmentId);
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            await axios.put(`${API_URL}/api/doctors/appointments`, {
                appointmentId,
                status: newStatus
            }, config);

            // Update local state
            setAppointments(prev =>
                prev.map(appt =>
                    appt.id === appointmentId ? {...appt, status: newStatus} : appt
                )
            );
        } catch (err) {
            console.error('Error updating appointment:', err);
            alert('Failed to update appointment status');
        } finally {
            setUpdating(null);
        }
    };

    if (loading) return <Spinner animation="border"/>;

    return (
        <Container fluid className="doctor-dashboard">
            <Row className="mb-4">
                <Col>
                    <h2 className="dashboard-title">Welcome, Dr. {currentUser?.name}</h2>
                    <p className="text-muted">Today: {new Date().toLocaleDateString()}</p>
                </Col>
            </Row>

            {/* Quick Stats Cards */}
            <Row className="mb-4">
                <Col md={4}>
                    <Card className="stat-card patients-card">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <Card.Title>Total Patients</Card.Title>
                                    <h2>{stats.totalPatients}</h2>
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
                                    <Card.Title>Today's Appointments</Card.Title>
                                    <h2>{stats.todayAppointments}</h2>
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
                                    <Card.Title>Prescriptions</Card.Title>
                                    <h2>{stats.prescriptions}</h2>
                                </div>
                                <div className="stat-icon">
                                    <i className="fas fa-prescription-bottle-alt"></i>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Upcoming Appointments */}
            <Row className="mb-4">
                <Col>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <Card.Title>Today's Appointments</Card.Title>
                                <Link to="/doctor/appointments">
                                    <Button variant="outline-primary" size="sm">
                                        View All
                                    </Button>
                                </Link>
                            </div>

                            <Table striped bordered hover responsive>
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Patient</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Reason</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {appointments.map((appt, index) => (
                                    <tr key={appt.id}>
                                        <td>{index + 1}</td>
                                        <td>{appt.User?.name}</td>
                                        <td>{appt.appointmentDate}</td>
                                        <td>{appt.appointmentTime}</td>
                                        <td>{appt.reason}</td>
                                        <td>{appt.status}</td>
                                        <td>
                                            {appt.status === 'pending' && (
                                                <>
                                                    <Button
                                                        variant="success"
                                                        size="sm"
                                                        className="me-2"
                                                        disabled={updating === appt.id}
                                                        onClick={() => updateStatus(appt.id, 'approved')}
                                                    >
                                                        {updating === appt.id ? 'Approving...' : 'Approve'}
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        disabled={updating === appt.id}
                                                        onClick={() => updateStatus(appt.id, 'cancelled')}
                                                    >
                                                        {updating === appt.id ? 'Cancelling...' : 'Cancel'}
                                                    </Button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <Card.Title>Queue Management</Card.Title>
                                <Link to="/doctor/queue">
                                    <Button variant="outline-primary" size="sm">
                                        Manage Queue
                                    </Button>
                                </Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/*/!* Quick Actions *!/*/}
            {/*<Row>*/}
            {/*    <Col md={6}>*/}
            {/*        <Card className="shadow-sm mb-4">*/}
            {/*            <Card.Body>*/}
            {/*                <Card.Title>Quick Actions</Card.Title>*/}
            {/*                <div className="d-grid gap-2 mt-3">*/}
            {/*                    <Link to="/doctor/new-appointment">*/}
            {/*                        <Button variant="primary" className="text-start">*/}
            {/*                            <i className="fas fa-plus-circle me-2"></i> Schedule New Appointment*/}
            {/*                        </Button>*/}
            {/*                    </Link>*/}
            {/*                    <Link to="/doctor/new-prescription">*/}
            {/*                        <Button variant="success" className="text-start">*/}
            {/*                            <i className="fas fa-prescription-bottle-alt me-2"></i> Create Prescription*/}
            {/*                        </Button>*/}
            {/*                    </Link>*/}
            {/*                    <Link to="/doctor/patients">*/}
            {/*                        <Button variant="info" className="text-start">*/}
            {/*                            <i className="fas fa-user-injured me-2"></i> View Patients*/}
            {/*                        </Button>*/}
            {/*                    </Link>*/}
            {/*                </div>*/}
            {/*            </Card.Body>*/}
            {/*        </Card>*/}
            {/*    </Col>*/}

            {/*    <Col md={6}>*/}
            {/*        <Card className="shadow-sm mb-4">*/}
            {/*            <Card.Body>*/}
            {/*                <Card.Title>Recent Messages</Card.Title>*/}

            {/*                <div className="text-center mt-3">*/}
            {/*                    <Link to="/doctor/messages">*/}
            {/*                        <Button variant="outline-secondary" size="sm">*/}
            {/*                            View All Messages*/}
            {/*                        </Button>*/}
            {/*                    </Link>*/}
            {/*                </div>*/}
            {/*            </Card.Body>*/}
            {/*        </Card>*/}
            {/*    </Col>*/}
            {/*</Row>*/}
            {
                doctor && doctor.isApproved ? "" :
                    <Link to={"/doctor/register"}>Verify Doctor</Link>
            }
        </Container>
    );
};

export default DoctorDashboard;