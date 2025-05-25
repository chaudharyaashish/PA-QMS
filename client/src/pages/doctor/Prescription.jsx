import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { API_URL } from '../../config'; 

const PrescriptionModal = ({ show, handleClose, appointmentId, onPrescriptionCreated }) => {
    const [prescriptionText, setPrescriptionText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        setPrescriptionText('');
        setError(null);
        setSuccessMessage(null);
    }, [show, appointmentId]);

    const handleChange = (e) => {
        setPrescriptionText(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };

            const response = await axios.post(
                `${API_URL}/api/prescriptions`,
                { appointmentId, prescriptionText },
                config
            );

            setSuccessMessage('Prescription created successfully!');
            onPrescriptionCreated(); 
            handleClose(); 
        } catch (err) {
            setError(err.response?.data?.message || 'Error creating prescription');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Create Prescription</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                {successMessage && <Alert variant="success">{successMessage}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Prescription Text</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={5}
                            value={prescriptionText}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? <Spinner animation="border" size="sm" /> : 'Create Prescription'}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default PrescriptionModal;
