import React, { useContext, useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const DoctorDashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  console.log(currentUser);
  return (
    <Container>
      <h2 className="mb-4">Welcome, {currentUser?.name}!</h2>

      <Row>
        <Col md={4}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title>User Information</Card.Title>
              <div className="mt-4">
                <p>
                  <strong>Name:</strong> {currentUser?.name}
                </p>
                <p>
                  <strong>Email:</strong> {currentUser?.email}
                </p>
              </div>
              <div className="mt-4 text-center">
                <Link to="/user/profile">
                  <Button variant="outline-secondary">Update Profile</Button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Link to={"/doctor/register"}>Verify Doctor</Link>
    </Container>
  );
};

export default DoctorDashboard;
