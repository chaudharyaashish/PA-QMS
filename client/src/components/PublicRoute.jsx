import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Spinner from 'react-bootstrap/Spinner';

const PublicRoute = ({ children }) => {
    const { currentUser, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    if (currentUser) {
        // Redirect based on role
        switch (currentUser.role) {
            case 'user':
                return <Navigate to="/user/dashboard" />;
            case 'doctor':
                return <Navigate to="/doctor/dashboard" />;
            case 'admin':
                return <Navigate to="/admin/dashboard" />;
            default:
                return <Navigate to="/" />;
        }
    }

    return children;
};

export default PublicRoute;