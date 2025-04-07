import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Spinner, Alert } from 'react-bootstrap';
import { API_URL } from '../../config';

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

            const response = await axios.get(`${API_URL}/api/admin/appointments`, config);
            setAppointments(response.data);
        } catch (err) {
            console.error('Error fetching appointments:', err);
            setError('Failed to load appointments');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Spinner animation="border" />;

    return (
        <div>
            <h2>All Appointments</h2>
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
                        </tr>
                    </thead>
                    <tbody>
                        {appointments && appointments.map((appt, index) => (
                            <tr key={appt.id}>
                                <td>{index + 1}</td>
                                <td>{appt.Doctor?.User?.name}</td>
                                <td>{appt.Doctor?.specialization}</td>
                                <td>{appt.appointmentDate}</td>
                                <td>{appt.appointmentTime}</td>
                                <td>{appt.reason}</td>
                                <td>{appt.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
}
