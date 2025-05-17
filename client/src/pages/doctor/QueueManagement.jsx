// client/src/pages/doctor/QueueManagement.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Card, Button, Badge, Alert } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { API_URL } from '../../config';
import { toast } from 'react-toastify';

const QueueManagement = () => {
    const { currentUser } = useContext(AuthContext);
    const [queue, setQueue] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPatient, setCurrentPatient] = useState(null);

    console.log(currentPatient);
    const fetchQueue = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${API_URL}/api/queue/doctor/queue`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const queueData = response.data;
            setQueue(queueData.filter(q => q.status === 'waiting'));
            const inProgress = queueData.find(q => q.status === 'in-progress');
            setCurrentPatient(inProgress || null);

        } catch (error) {
            toast.error('Error fetching queue data');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchQueue();
        // Set up polling every 30 seconds
        const interval = setInterval(fetchQueue, 30000);
        return () => clearInterval(interval);
    }, [currentUser.doctorId]);

    const handleNextPatient = async () => {
        try {
            if (currentPatient) {
                // Complete current patient
                await axios.patch(
                    `${API_URL}/api/queue/${currentPatient.id}/status`,
                    { status: 'completed' },
                    { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
                );
            }

            if (queue.length > 0) {
                // Call next patient
                const nextPatient = queue[0];
                await axios.patch(
                    `${API_URL}/api/queue/${nextPatient.id}/status`,
                    { status: 'in-progress' },
                    { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
                );
            }

            fetchQueue();
            toast.success('Queue updated successfully');
        } catch (error) {
            toast.error('Error updating queue');
            console.error('Error:', error);
        }
    };

    const handleMarkNoShow = async (queueId) => {
        try {
            await axios.patch(
                `${API_URL}/api/queue/${queueId}/status`,
                { status: 'no-show' },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            fetchQueue();
            toast.info('Patient marked as no-show');
        } catch (error) {
            toast.error('Error updating status');
            console.error('Error:', error);
        }
    };

    if (loading) {
        return (
            <div className="text-center my-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container my-4">
            <h2 className="mb-4">Queue Management</h2>

            {/* Current Patient Card */}
            <Card className="mb-4">
                <Card.Header className="bg-primary text-white">
                    <h5 className="mb-0">Current Patient</h5>
                </Card.Header>
                <Card.Body>
                    {currentPatient ? (
                        <>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h4>{currentPatient.Appointment.User.name}</h4>
                                    <p className="mb-1">Queue Number: {currentPatient.queueNumber}</p>
                                    <p className="mb-1">Time: {new Date(currentPatient.checkInTime).toLocaleTimeString()}</p>
                                </div>
                                <Button 
                                    variant="success" 
                                    onClick={handleNextPatient}
                                >
                                    Complete & Call Next
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center">
                            {queue.length > 0 ? (
                                <Button 
                                    variant="primary" 
                                    onClick={handleNextPatient}
                                >
                                    Call Next Patient
                                </Button>
                            ) : (
                                <Alert variant="info">No patients in queue</Alert>
                            )}
                        </div>
                    )}
                </Card.Body>
            </Card>

            {/* Waiting List */}
            <Card>
                <Card.Header className="bg-secondary text-white">
                    <h5 className="mb-0">Waiting List ({queue.length})</h5>
                </Card.Header>
                <Card.Body>
                    {queue.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Queue #</th>
                                        <th>Patient Name</th>
                                        <th>Appointment Time</th>
                                        <th>Wait Time</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {queue.map((item) => {
                                        const waitTime = Math.round(
                                            (new Date() - new Date(item.checkInTime)) / 1000 / 60
                                        );
                                        return (
                                            <tr key={item.id}>
                                                <td>{item.queueNumber}</td>
                                                <td>{item.Appointment.User.name}</td>
                                                <td>
                                                    {new Date(item.Appointment.appointmentTime).toLocaleTimeString()}
                                                </td>
                                                <td>
                                                    <Badge bg={waitTime > 30 ? 'danger' : 'info'}>
                                                        {waitTime} mins
                                                    </Badge>
                                                </td>
                                                <td>
                                                    <Button
                                                        variant="warning"
                                                        size="sm"
                                                        onClick={() => handleMarkNoShow(item.id)}
                                                    >
                                                        Mark No-Show
                                                    </Button>
                                                </td>
                                            </tr>
                                        )}
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <Alert variant="info">No patients waiting</Alert>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
};

export default QueueManagement;