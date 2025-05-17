import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Spinner, Alert, Button } from 'react-bootstrap';
import { API_URL } from '../../config';
import { Link } from 'react-router-dom';

export default function Appointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

            const response = await axios.get(`${API_URL}/api/appointments`, config);
            setAppointments(response.data);
        } catch (err) {
            console.error('Error fetching appointments:', err);
            setError('Failed to load appointments');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (appointmentId) => {
        const confirm = window.confirm("Are you sure you want to cancel this appointment?");
        if (!confirm) return;

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            await axios.delete(`${API_URL}/api/appointments/${appointmentId}`, config);
            setAppointments(prev => prev.filter(appt => appt.id !== appointmentId));
            alert("Appointment cancelled.");
        } catch (err) {
            console.error("Cancellation error:", err);
            alert("Failed to cancel appointment.");
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
                            <th>Doctor</th>
                            <th>Specialization</th>
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
                                <td>{appt.Doctor?.User?.name}</td>
                                <td>{appt.Doctor?.specialization}</td>
                                <td>{appt.appointmentDate}</td>
                                <td>{appt.appointmentTime}</td>
                                <td>{appt.reason}</td>
                                <td>
                                    <span className={`badge ${appt.status === 'approved' ? 'bg-success' : 'bg-warning'}`}>
                                        {appt.status}
                                    </span>
                                </td>
                                <td>
                                    <div className="d-flex gap-2">
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => handleCancel(appt.id)}
                                            disabled={appt.status !== 'pending'}
                                        >
                                            Cancel
                                        </Button>
                                        <Link to={`/user/reshedule/${appt.id}`}>
                                            <Button variant="outline-secondary" size="sm" disabled={appt.status !== 'pending'}>
                                                Reschedule
                                            </Button>
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
}
