import React, { useContext, useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { API_URL } from '../../config';
import io from 'socket.io-client';

const UserDashboard = () => {
    const { currentUser } = useContext(AuthContext);
    const [appointments, setAppointments] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [queuePosition, setQueuePosition] = useState(null);
    const [estimatedTime, setEstimatedTime] = useState(null);
    const [loading, setLoading] = useState(true);
    const [queueLoading, setQueueLoading] = useState(true);
    const [chatMessages, setChatMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
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

    const handleSelfCheckIn = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            const response = await axios.post(`${API_URL}/api/queue/check-in`, {}, config);
            alert(response.data.message || 'Checked in successfully!');
            refreshQueueStatus();
        } catch (error) {
            alert(error.response?.data?.message || 'Error during self check-in.');
        }
    };

    useEffect(() => {
        const fetchPrescriptions = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const response = await axios.get(`${API_URL}/api/prescriptions`, config);
                setPrescriptions(response.data);
            } catch (error) {
                console.error('Error fetching prescriptions:', error);
            }
        };
        fetchPrescriptions();
    }, []);

    useEffect(() => {
        const newSocket = io(API_URL, {
            query: { token: localStorage.getItem('token') }
        });
        setSocket(newSocket);

        newSocket.on('receive-message', (msg) => {
            setChatMessages((prev) => [...prev, msg]);
        });

        return () => newSocket.disconnect();
    }, []);

    const sendMessage = () => {
        if (newMessage.trim() && socket) {
            socket.emit('send-message', {
                sender: currentUser.name,
                message: newMessage
            });
            setChatMessages((prev) => [...prev, { sender: 'You', message: newMessage }]);
            setNewMessage('');
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
                                    <div className="spinner-border text-primary" role="status" />
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
                                                                <span className={`badge ${app.status === 'approved' ? 'bg-success' : 'bg-warning'}`}>
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
                        <Col md={6}>
                            <Card className="mb-4 shadow-sm">
                                <Card.Body>
                                    <Card.Title>Recent Prescriptions</Card.Title>
                                    {prescriptions.length > 0 ? (
                                        <ul className="list-group">
                                            {prescriptions.slice(0, 3).map((pres, index) => (
                                                <li className="list-group-item" key={index}>
                                                    <strong>Doctor:</strong> {pres.Doctor?.User?.name || 'N/A'}<br />
                                                    <strong>Date:</strong> {new Date(pres.date).toLocaleDateString()}<br />
                                                    <strong>Notes:</strong> {pres.notes}
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
                                {queueLoading ? (
                                    <div className="text-center">
                                        <div className="spinner-border text-primary" role="status" />
                                    </div>
                                ) : (
                                    <>
                                        <p><strong>Current Queue Position:</strong> {queuePosition}</p>
                                        <p><strong>Estimated Wait Time:</strong> {estimatedTime}</p>
                                    </>
                                )}
                            </div>
                            <div className="mt-3 text-center">
                                <Button variant="outline-primary" onClick={refreshQueueStatus}>Refresh Status</Button>
                            </div>
                            <div className="mt-3 text-center">
                                <Button variant="success" onClick={handleSelfCheckIn}>Self Check-In</Button>
                            </div>
                        </Card.Body>
                    </Card>

                    {/* Chat Section */}
                    <Card className="mb-4 shadow-sm">
                        <Card.Body>
                            <Card.Title>Chat with Doctor</Card.Title>
                            <div style={{
                                border: '1px solid #ccc',
                                padding: '10px',
                                height: '200px',
                                overflowY: 'auto',
                                marginBottom: '10px'
                            }}>
                                {chatMessages.map((msg, idx) => (
                                    <div key={idx}><strong>{msg.sender}:</strong> {msg.message}</div>
                                ))}
                            </div>
                            <div className="d-flex">
                                <input
                                    type="text"
                                    className="form-control me-2"
                                    placeholder="Type your message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <Button variant="primary" onClick={sendMessage}>Send</Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default UserDashboard;
