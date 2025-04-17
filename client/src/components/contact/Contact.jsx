import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaPaperPlane, FaCheck } from 'react-icons/fa';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const phoneNumber = '+977-97xxxxxxxx';
  const emailAddress = 'admin@example.com';
  const secondaryEmail = 'patient@example.com';
  const hospitalAddress = 'ABC Hospital, New Baneshwor, Kathmandu';
  const googleMapsLink = 'https://www.google.com/maps/search/?api=1&query=Civil+Hospital+New+Baneshwor+Kathmandu';

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setIsSubmitting(false);
      toast.success('Your message has been sent successfully!');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 1500);
  };

  const handlePhoneClick = () => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleEmailClick = (email) => {
    window.location.href = `mailto:${email}`;
  };

  const handleAddressClick = () => {
    window.open(googleMapsLink, '_blank');
  };

  return (
    <Container className="my-5">
      <h1 className="text-center mb-4">Contact Us</h1>
      <p className="text-center mb-5">We'd love to hear from you! Send us a message and we'll respond as soon as possible.</p>
      
      <Row>
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm contact-card" onClick={handlePhoneClick}>
            <Card.Body className="text-center">
              <div className="icon-container mb-3">
                <FaPhone size={24} />
              </div>
              <Card.Title>Call Us</Card.Title>
              <Card.Text>
                {phoneNumber}<br />
                Mon-Fri: 9am-5pm
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm contact-card">
            <Card.Body className="text-center">
              <div className="icon-container mb-3">
                <FaEnvelope size={24} />
              </div>
              <Card.Title>Email Us</Card.Title>
              <Card.Text>
                <span 
                  className="email-link" 
                  onClick={() => handleEmailClick(emailAddress)}
                >
                  {emailAddress}
                </span>
                <br />
                <span 
                  className="email-link" 
                  onClick={() => handleEmailClick(secondaryEmail)}
                >
                  {secondaryEmail}
                </span>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm contact-card" onClick={handleAddressClick}>
            <Card.Body className="text-center">
              <div className="icon-container mb-3">
                <FaMapMarkerAlt size={24} />
              </div>
              <Card.Title>Visit Us</Card.Title>
              <Card.Text>
                {hospitalAddress}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Contact;