import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Spinner } from 'react-bootstrap';
import { API_URL } from '../../config';

export default function Doctors() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [approving, setApproving] = useState(null);

    useEffect(() => {
        fetchDoctors();
        console.log(doctors)
    }, []);

    const fetchDoctors = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const response = await axios.get(`${API_URL}/api/admin/doctors`, config);
            setDoctors(response.data)
        } catch (error) {
            console.error('Error fetching doctors:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (doctorId) => {
        setApproving(doctorId);
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            await axios.patch(`${API_URL}/api/admin/doctors/${doctorId}/approve`, {}, config);
            setDoctors(prevDoctors =>
                prevDoctors.map(doc =>
                    doc.id === doctorId ? { ...doc, isApproved: true } : doc
                )
            );
        } catch (error) {
            console.error('Error approving doctor:', error);
        } finally {
            setApproving(null);
        }
    };

    if (loading) return <Spinner animation="border" variant="primary" />;

    return (
        <div>
            <h2>Doctors</h2>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Specialization</th>
                        <th>Liecense</th>
                        <th>Experience</th>
                        <th>Qualifications</th>
                        <th>Availability</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {doctors.length > 0 && doctors.map((doctor, index) => (
                        <tr key={doctor.id}>
                            <td>{index + 1}</td>
                            <td>{doctor.User?.name}</td>
                            <td>{doctor.User?.email}</td>
                            <td>{doctor.User?.phone}</td>
                            <td>{doctor.User?.address}</td>
                            <td>{doctor.specialization}</td>
                            <td>{doctor.license}</td>
                            <td>{doctor.experience} yrs</td>
                            <td>{doctor.qualifications}</td>
                            <td>{doctor.availableDays} <br />{doctor.availableTimeStart} - {doctor.availableTimeEnd}</td>
                            <td>{doctor.isApproved ? 'Approved' : 'Pending'}</td>
                            <td>
                                {!doctor.isApproved && (
                                    <Button
                                        variant="success"
                                        size="sm"
                                        disabled={approving === doctor.id}
                                        onClick={() => handleApprove(doctor.id)}
                                    >
                                        {approving === doctor.id ? 'Approving...' : 'Approve'}
                                    </Button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}
