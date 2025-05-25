
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {API_URL} from "../../config.js";

const SelfCheckIn = () => {
    const [todayAppointments, setTodayAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTodayAppointments();
    }, []);

    const fetchTodayAppointments = async () => {
        try {
            const response = await axios.get(API_URL + '/api/appointments/today',{
                headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
            });
            console.log(response.data.appointments);
            setTodayAppointments(response.data.appointments);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching appointments');
            setLoading(false);
        }
    };

    const handleCheckIn = async (appointmentId) => {
        try {
            await axios.post(API_URL + '/api/queue/check-in', { appointmentId },{
                headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
            });
            toast.success('Check-in successful!');
            fetchTodayAppointments(); // Refresh the list
        } catch (error) {
            console.error(error.response?.data?.message || 'Check-in failed');
        }
    };

    const formatTime = (time) => {
        return new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Today's Appointments</h1>
            
            {todayAppointments.length === 0 ? (
                <div className="bg-gray-50 p-6 rounded-lg text-center">
                    <p>No appointments scheduled for today.</p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {todayAppointments.map((appointment) => (
                        <div key={appointment.id} 
                             className="bg-white rounded-lg shadow-md p-6 border">
                            <div className="mb-4">
                                <h2 className="text-xl font-semibold">
                                    Dr. {appointment.Doctor.User.name}
                                </h2>
                                <p className="text-gray-600">
                                    {appointment.Doctor.specialization}
                                </p>
                            </div>
                            
                            <div className="mb-4">
                                <p className="text-gray-700">
                                    Time: {formatTime(appointment.appointmentTime)}
                                </p>
                                <p className="text-gray-700">
                                    Status: <span className="font-medium">
                                        {appointment.status}
                                    </span>
                                </p>
                                {appointment.Queue && (
                                    <p className="text-green-600 font-medium">
                                        Queue Number: {appointment.Queue.queueNumber}
                                    </p>
                                )}
                            </div>

                            {!appointment.Queue && appointment.status === 'approved' && (
                                <button
                                    onClick={() => handleCheckIn(appointment.id)}
                                    className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition-colors"
                                >
                                    Self Check-In
                                </button>
                            )}
                            
                            {appointment.Queue && (
                                <div className="bg-green-50 p-3 rounded-md">
                                    <p className="text-green-700">
                                        ✓ Checked In
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SelfCheckIn;