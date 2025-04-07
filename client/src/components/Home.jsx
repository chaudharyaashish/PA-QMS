import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import axios from "axios";
import { API_URL } from "../config";
import img from "../Images/doctor.png"

const Home = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/doctors`);
        setDoctors(response.data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <Container>
      <Row className="mb-5">
        <Col md={6} className="d-flex align-items-center">
          <div>
            <h1 className="display-4 mb-4">
              Welcome to Doctor Appointment System
            </h1>
            <p className="lead mb-4">
              Book appointments with qualified doctors easily and manage your
              health efficiently.
            </p>
            <div className="d-flex gap-2">
              <Link to="/register">
                <Button variant="primary" size="lg">
                  Register Now
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline-primary" size="lg">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </Col>
        <Col md={6}>
          <img
            src={img}
            alt="Healthcare"
            className="img-fluid rounded shadow"
          />
        </Col>
      </Row>

      <h2 className="text-center mb-4">Our Doctors</h2>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <Row>
          {doctors.length > 0 ? (
            doctors.map((doctor) => (
              <Col key={doctor.id} md={4} className="mb-4">
                <Card className="h-100 shadow-sm">
                  <Card.Body>
                    <Card.Title>{doctor.User.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {doctor.specialization}
                    </Card.Subtitle>
                    <Card.Text>
                      Experience: {doctor.experience} years
                      <br />
                      Qualifications: {doctor.qualifications}
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    <Link to="/login">
                      <Button variant="primary" block>
                        Book Appointment
                      </Button>
                    </Link>
                  </Card.Footer>
                </Card>
              </Col>
            ))
          ) : (
            <Col className="text-center">
              <p>No doctors available at the moment.</p>
            </Col>
          )}
        </Row>
      )}

      <Row className="my-5">
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm text-center p-4">
            <Card.Body>
              <div className="mb-3">
                <i
                  className="bi bi-calendar-check"
                  style={{ fontSize: "2rem", color: "#0d6efd" }}
                ></i>
              </div>
              <Card.Title>Easy Appointment Booking</Card.Title>
              <Card.Text>
                Book appointments with just a few clicks. Choose the doctor,
                date, and time that works for you.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm text-center p-4">
            <Card.Body>
              <div className="mb-3">
                <i
                  className="bi bi-person-check"
                  style={{ fontSize: "2rem", color: "#0d6efd" }}
                ></i>
              </div>
              <Card.Title>Qualified Doctors</Card.Title>
              <Card.Text>
                Our platform features only verified and qualified healthcare
                professionals.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm text-center p-4">
            <Card.Body>
              <div className="mb-3">
                <i
                  className="bi bi-clock-history"
                  style={{ fontSize: "2rem", color: "#0d6efd" }}
                ></i>
              </div>
              <Card.Title>Appointment Management</Card.Title>
              <Card.Text>
                Easily manage your appointments. View history, reschedule, or
                cancel if needed.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
