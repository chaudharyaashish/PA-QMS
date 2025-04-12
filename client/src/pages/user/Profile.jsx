import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import { Button, Form, Alert, Spinner, Modal } from 'react-bootstrap';
import "./Profile.css"

export default function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const response = await axios.get(`${API_URL}/api/users/profile`, config);
            setUser(response.data);
            setName(response.data.name);
            setPhone(response.data.phone);
            setAddress(response.data.address);
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateClick = () => {
        setShowForm(true);
    };

    const handleSaveClick = (e) => {
        e.preventDefault();
        setShowModal(true);
    };

    const handleConfirmUpdate = async () => {
        setShowModal(false);
        setUpdating(true);

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const updatedData = { name, phone, address };
            const response = await axios.put(`${API_URL}/api/users/profile`, updatedData, config);

            setUser(response.data.user);
            setError(null);
            setShowForm(false); // hide form after successful update
        } catch (err) {
            console.error('Error updating profile:', err);
            setError('Failed to update profile');
        } finally {
            setUpdating(false);
        }
    };

    const handleCancelUpdate = () => {
        setShowModal(false);
        setShowForm(false);
        // Reset to original user data
        setName(user.name);
        setPhone(user.phone);
        setAddress(user.address);
    };

    if (loading) return (
        <div className="spinner-container">
            <Spinner animation="border" />
        </div>
    );

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h2>User Profile</h2>
            </div>
    
            {error && <Alert variant="danger">{error}</Alert>}
    
            {/* Profile Details First */}
            <div className="profile-details">
                <h4>Profile Details</h4>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Phone:</strong> {user.phone}</p>
                <p><strong>Address:</strong> {user.address}</p>
                <p><strong>Role:</strong> {user.role}</p>
            </div>
    
            {/* Show form only when Update Profile is clicked */}
            {showForm ? (
                <Form onSubmit={handleSaveClick} className="profile-form">
                    <Form.Group controlId="name" className="form-group">
                        <Form.Label className="form-label">Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="form-control"
                        />
                    </Form.Group>
                    <Form.Group controlId="phone" className="form-group">
                        <Form.Label className="form-label">Phone</Form.Label>
                        <Form.Control
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="form-control"
                        />
                    </Form.Group>
                    <Form.Group controlId="address" className="form-group">
                        <Form.Label className="form-label">Address</Form.Label>
                        <Form.Control
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="form-control"
                        />
                    </Form.Group>
                    <Button variant="success" type="submit" disabled={updating} className="update-button">
                        {updating ? 'Updating...' : 'Save Changes'}
                    </Button>
                </Form>
            ) : (
                <Button variant="primary" onClick={handleUpdateClick} className="update-button">
                    Update Profile
                </Button>
            )}
    
            {/* Confirmation Modal */}
            <Modal show={showModal} onHide={handleCancelUpdate}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Update</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to save these changes?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCancelUpdate}>
                        No
                    </Button>
                    <Button variant="primary" onClick={handleConfirmUpdate}>
                        Yes, Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
    
}
