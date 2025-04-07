import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Form, Button, Spinner, Alert } from 'react-bootstrap';
import { API_URL } from '../../config';

const BookAppointment = () => {
    const [doctors, setDoctors] = useState([]);
    const [formData, setFormData] = useState({
        doctorId: '',
        appointmentDate: '',
        appointmentTime: '',
        reason: ''
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchApprovedDoctors();
    }, []);

    const fetchApprovedDoctors = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            const response = await axios.get(`${API_URL}/api/doctors`, config);
            const approvedDoctors = response.data.filter(doc => doc.isApproved);
            setDoctors(approvedDoctors);
            console.log(doctors)
        } catch (err) {
            console.error('Error fetching doctors:', err);
            setError('Failed to load doctors');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage(null);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            const response = await axios.post(`${API_URL}/api/appointments`, formData, config);
            setMessage(response.data.message);
            setFormData({
                doctorId: '',
                appointmentDate: '',
                appointmentTime: '',
                reason: ''
            });
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Appointment creation failed');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <Spinner animation="border" />;

    return (
        <>
            <h2>Book Appointment</h2>
            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Select Doctor</Form.Label>
                    <Form.Select name="doctorId" value={formData.doctorId} onChange={handleChange} required>
                        <option value="">-- Select a Doctor --</option>
                        {doctors.map((doc) => (
                            <option key={doc.id} value={doc.id}>
                                {doc.User?.name} - {doc.specialization}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Appointment Date</Form.Label>
                    <Form.Control type="date" name="appointmentDate" value={formData.appointmentDate} onChange={handleChange} required />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Appointment Time</Form.Label>
                    <Form.Control type="time" name="appointmentTime" value={formData.appointmentTime} onChange={handleChange} required />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Reason for Visit</Form.Label>
                    <Form.Control type="text" name="reason" value={formData.reason} onChange={handleChange} required />
                </Form.Group>

                <Button variant="primary" type="submit" disabled={submitting}>
                    {submitting ? 'Booking...' : 'Book Appointment'}
                </Button>
            </Form>
        </>
    );
};

export default BookAppointment;
