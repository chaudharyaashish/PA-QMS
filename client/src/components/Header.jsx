import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

const Header = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Doctor Appointment System
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>

            {currentUser ? (
              <>
                {currentUser.role === "user" && (
                  <>
                    <Nav.Link as={Link} to="/user/book-appointment">
                      Book Appointment
                    </Nav.Link>
                    <Nav.Link as={Link} to="/user/appointments">
                      My Appointments
                    </Nav.Link>
                    {/* <Nav.Link as={Link} to="/doctor/register">Register as Doctor</Nav.Link> */}
                  </>
                )}

                {currentUser.role === "doctor" && (
                  <>
                    <Nav.Link as={Link} to="/doctor/appointments">
                      Manage Appointments
                    </Nav.Link>
                  </>
                )}

                {currentUser.role === "admin" && (
                  <>
                    <NavDropdown title="Admin" id="admin-dropdown">
                      <NavDropdown.Item as={Link} to="/admin/doctors">
                        Manage Doctors
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/admin/users">
                        Manage Users
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/admin/appointments">
                        All Appointments
                      </NavDropdown.Item>
                    </NavDropdown>
                  </>
                )}

                <NavDropdown title={currentUser.name} id="user-dropdown">
                  <NavDropdown.Item
                    as={Link}
                    to={`/${currentUser.role}/dashboard`}
                  >
                    Dashboard
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/user/profile">
                    My Profile
                  </NavDropdown.Item>
                  {currentUser.role === "doctor" && (
                    <NavDropdown.Item as={Link} to="/doctor/profile">
                      Doctor Profile
                    </NavDropdown.Item>
                  )}
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
