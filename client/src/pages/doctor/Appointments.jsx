import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Spinner, Alert, Button } from 'react-bootstrap';
import { API_URL } from '../../config';
import PrescriptionModal from './Prescription.jsx';

export default function Appointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updating, setUpdating] = useState(null);
    const [prescriptions, setPrescriptions] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

    useEffect(() => {
        fetchAppointments();
        fetchPrescriptions();
    }, []);

    const fetchAppointments = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.get(`${API_URL}/api/doctors/appointments`, config);
            setAppointments(response.data);
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
            setPrescriptions(response.data);
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
                    Authorization: `Bearer ${token}`,
                },
            };

            await axios.put(`${API_URL}/api/doctors/appointments`, {
                appointmentId,
                status: newStatus,
            }, config);

            setAppointments((prev) =>
                prev.map((appt) =>
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

    const handleShowModal = (appointmentId) => {
        setSelectedAppointmentId(appointmentId);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedAppointmentId(null);
    };

    const handlePrescriptionCreated = () => {
        fetchAppointments();
        fetchPrescriptions();
    };

    console.log(prescriptions);
    const getPrescriptionForAppointment = (appointmentId) => {
        return prescriptions.find(p => p.appointmentId === appointmentId);
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
                    {appointments.map((appt, index) => {
                        const existingPrescription = getPrescriptionForAppointment(appt.id);

                        return (
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
                                    {existingPrescription ? (
                                        <Button
                                            variant="info"
                                            size="sm"
                                            onClick={() => alert(existingPrescription.prescriptionText)}
                                        >
                                            View Prescription
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={() => handleShowModal(appt.id)}
                                        >
                                            Create Prescription
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </Table>
            )}

            {/* Prescription Modal */}
            <PrescriptionModal
                show={showModal}
                handleClose={handleCloseModal}
                appointmentId={selectedAppointmentId}
                onPrescriptionCreated={handlePrescriptionCreated}
            />
        </div>
    );
}
