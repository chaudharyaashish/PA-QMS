import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Spinner, Badge } from 'react-bootstrap';
import { API_URL } from '../../config';

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const response = await axios.get(`${API_URL}/api/admin/users`, config);
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const getUserTypeBadge = (type) => {
        const typeLower = type.toLowerCase();
        let bgColor = 'secondary';
        
        if (typeLower === 'admin') bgColor = 'danger';
        if (typeLower === 'doctor') bgColor = 'primary';
        if (typeLower === 'patient') bgColor = 'success';
        if (typeLower === 'user') bgColor = 'info';

        return (
            <Badge 
                bg={bgColor} 
                style={{
                    fontSize: '0.875rem',
                    padding: '0.35em 0.65em',
                    minWidth: '70px',
                    display: 'inline-block',
                    textAlign: 'center'
                }}
            >
                {type}
            </Badge>
        );
    };

    if (loading) return <Spinner animation="border" variant="primary" />;

    return (
        <div>
            <h2>Users</h2>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>User Type</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Address</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 && users.map((user, index) => (
                        <tr key={user.id}>
                            <td>{index + 1}</td>
                            <td>{user.name}</td>
                            <td>{getUserTypeBadge(user.role || 'User')}</td>
                            <td>{user.email}</td>
                            <td>{user.phone || '-'}</td>
                            <td>{user.address || '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}