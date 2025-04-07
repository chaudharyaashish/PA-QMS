import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Spinner, Alert, Button } from 'react-bootstrap';
import { API_URL } from '../../config';

export default function Appointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updating, setUpdating] = useState(null);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const response = await axios.get(`${API_URL}/api/doctors/appointments`, config);
            console.log(response.data)
            setAppointments(response.data);
        } catch (err) {
            console.error('Error fetching appointments:', err);
            setError('Failed to load appointments');
        } finally {
            setLoading(false);
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
                    appt.id === appointmentId ? { ...appt, status: newStatus } : appt
                )
            );
        } catch (err) {
            console.error('Error updating appointment:', err);
            alert('Failed to update appointment status');
        } finally {
            setUpdating(null);
        }
    };

    if (loading) return <Spinner animation="border" />;

    return (
        <div>
            <h2>My Appointments</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {appointments.length === 0 ? (
                <p>No appointments found.</p>
            ) : (
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
            )}
        </div>
    );
}
