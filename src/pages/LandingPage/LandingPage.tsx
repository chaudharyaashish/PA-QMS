import { Link } from "react-router-dom";
import img from "../../images/doctor.png";
import "./LandingPage.css";

export default function LandingPage() {
  return (
    <>
      {/* Navbar Section */}
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-content">
            {/* Logo */}
            <div className="navbar-logo">
              <div className="logo-text">
                <span className="text-green-800">PA</span> &{" "}
                <span className="text-blue-900">QMS</span>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="navbar-links">
              <Link to="/" className="nav-link">
                Home
              </Link>
              <Link to="/services" className="nav-link">
                Services
              </Link>
              <Link to="/contact" className="nav-link">
                Contact Us
              </Link>
              <Link to="/help" className="nav-link">
                Help
              </Link>
            </div>

            {/* Authentication Actions */}
            <div className="navbar-actions">
              <Link to="/signup" className="nav-link">
                Sign Up
              </Link>
              <Link to="/signin" className="nav-link">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Healthcare Section */}
      <section className="healthcare-section">
        {/* Left Side - Text Content */}
        <div className="content">
          <span className="font-semibold">
            <span className="text-black">Providing Quality </span>
            <span className="text-primary">Healthcare </span>
            <span>For a</span>
            <br />
            <span className="text-green-600">Brighter </span>
            <span>And </span>
            <span className="text-green-600">Healthy Future</span>
          </span>

          <p className="description">
            At our hospital, we are dedicated to providing exceptional medical
            care to our patients and their families. Our experienced team of
            medical professionals, cutting-edge technology, and compassionate
            approach make us a leader in the healthcare industry.
          </p>
          <div className="book-app">
            {/* Book Appointment Button */}
            <Link to="/book-appointment" className="btn-book-appointment">
            Book Appointment
            </Link>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="image-container">
          <img
            src={img}
            alt="key photo"
            className="rounded-xl"
            loading="lazy"
          />
        </div>

        {/* Bottom - Search Section
        <div className="search-box">
          <p className="service-text">24/7 Service</p>
          <h3 className="search-title">Find a Doctor</h3>
          <div className="search-form">
            <input type="text" placeholder="Name" className="input-field" />
            <input
              type="text"
              placeholder="Speciality"
              className="input-field"
            />
            <input
              type="text"
              placeholder="Availability"
              className="input-field"
            />
            <button className="search-button">Search</button>
          </div>
        </div> */}
      </section>
    </>
  );
}
