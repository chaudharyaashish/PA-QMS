import React, { useState } from 'react';
import "./Services.css";

const Services = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    notes: ''
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const medicalServices = [
    {
      id: 1,
      title: "General Consultation",
      description: "Comprehensive health assessment with a primary care physician for general health concerns.",
      duration: "30 min",
      price: "$100",
      icon: "🩺"
    },
    {
      id: 2,
      title: "Pediatric Care",
      description: "Specialized care for infants, children, and adolescents with board-certified pediatricians.",
      duration: "45 min",
      price: "$120",
      icon: "👶"
    },
    {
      id: 3,
      title: "Cardiology Checkup",
      description: "Heart health evaluation including ECG and consultation with a cardiologist.",
      duration: "60 min",
      price: "$250",
      icon: "❤️"
    },
    {
      id: 4,
      title: "Dermatology",
      description: "Skin health evaluation and treatment for conditions like acne, eczema, and skin cancer screening.",
      duration: "30 min",
      price: "$150",
      icon: "🧴"
    },
    {
      id: 5,
      title: "Orthopedic Consultation",
      description: "Evaluation and treatment for musculoskeletal issues, joint pain, and sports injuries.",
      duration: "45 min",
      price: "$180",
      icon: "🦴"
    },
    {
      id: 6,
      title: "Mental Health Therapy",
      description: "Counseling and psychiatric services for anxiety, depression, and other mental health conditions.",
      duration: "50 min",
      price: "$200",
      icon: "🧠"
    }
  ];

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setBookingSuccess(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Booking submitted:', { service: selectedService, ...formData });
    setBookingSuccess(true);
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      date: '',
      time: '',
      notes: ''
    });
  };

  const handleCancel = () => {
    setSelectedService(null); // Deselect the selected service
    setFormData({
      name: '',
      email: '',
      phone: '',
      date: '',
      time: '',
      notes: ''
    });
    setBookingSuccess(false); // Hide the success message if visible
  };
  

  return (
    <div className="page-container">
      <header className="header">
        <h1 className="header-title">Our Medical Services</h1>
        <p className="header-subtitle">Quality healthcare tailored to your needs</p>
      </header>

      <div className="content-container">
        <div className="services-grid">
          {medicalServices.map(service => (
            <div 
              key={service.id} 
              className={`service-card ${selectedService?.id === service.id ? 'selected' : ''}`}
              onClick={() => handleServiceSelect(service)}
            >
              <div className="service-icon">{service.icon}</div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
              <div className="service-meta">
                <span>{service.duration}</span>
                <span>{service.price}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="booking-section">
          <h2 className="booking-title">
            {selectedService ? `Book ${selectedService.title}` : 'Select a Service'}
          </h2>
          
          {selectedService && (
            <form onSubmit={handleSubmit} className="booking-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="date">Date</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="time">Time</label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="notes">Additional Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                />
              </div>
              <div className="button-group">
                <button type="submit" className="submit-button">
                    Confirm Appointment
                </button>
                <button type="button" className="cancel-button" onClick={handleCancel}>
                    Cancel
                </button>
                </div>

              {bookingSuccess && (
                <div className="success-message">
                  Your appointment for {selectedService.title} has been booked successfully!
                </div>
              )}
            </form>
          )}
          
          {!selectedService && (
            <div className="placeholder">
              <p>Please select a medical service from the list to book an appointment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Services;