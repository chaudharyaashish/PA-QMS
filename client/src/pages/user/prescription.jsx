import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Spinner, Alert } from 'react-bootstrap';
import { API_URL } from '../../config';

export default function PrescriptionPage() {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPrescriptions();
    }, []);

    const fetchPrescriptions = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.get(`${API_URL}/api/prescriptions`, config);
            setPrescriptions(response.data);
        } catch (err) {
            console.error('Error fetching prescriptions:', err);
            setError('Failed to load prescriptions');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Spinner animation="border" />;

    return (
        <div>
            <h2>My Prescriptions</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {prescriptions.length === 0 ? (
                <p>No prescriptions found.</p>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Doctor</th>
                        <th>Appointment Date</th>
                        <th>Appointment Time</th>
                        <th>Prescription</th>
                    </tr>
                    </thead>
                    <tbody>
                    {prescriptions.map((prescription, index) => (
                        <tr key={prescription.id}>
                            <td>{index + 1}</td>
                            <td>{prescription.Doctor?.User?.name}</td>
                            <td>{prescription.Appointment?.appointmentDate}</td>
                            <td>{prescription.Appointment?.appointmentTime}</td>
                            <td>{prescription.prescriptionText}</td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
}
