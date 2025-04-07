import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Spinner } from 'react-bootstrap';
import { API_URL } from '../../config';

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
        console.log(users)
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
            setUsers(response.data)
        } catch (error) {
            console.error('Error fetching userss:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Spinner animation="border" variant="primary" />;

    return (
        <div>
            <h2>userss</h2>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Address</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 && users.map((users, index) => (
                        <tr key={users.id}>
                            <td>{index + 1}</td>
                            <td>{users.name}</td>
                            <td>{users.email}</td>
                            <td>{users.phone}</td>
                            <td>{users.address}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}
