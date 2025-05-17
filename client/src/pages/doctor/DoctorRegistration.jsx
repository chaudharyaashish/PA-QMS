import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { API_URL } from "../../config";
import {doctorSpecializations, doctorQualifications} from "../../constant";
import {useNavigate} from "react-router-dom";

export default function DoctorRegistration() {
  const [formData, setFormData] = useState({
    specialization: "",
    experience: "",
    qualifications: "",
    availableDays: "",
    availableTimeStart: "",
    availableTimeEnd: "",
    license: "",
  });

  const navigate = useNavigate()()
  const [selectedCategory, setSelectedCategory] = useState("");
  const [qualificationCategory, setQualificationCategory] = useState("");

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    setFormData({
      ...formData,
      specialization: ""
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(
          `${API_URL}/api/doctors/register`,
          formData,
          config
      );

      console.log(response);
      alert(response.data.message);
      navigate("/doctor/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
      <>
        <h1>Verify Details</h1>
        <Form onSubmit={handleSubmit}>

          <Form.Group className="mb-3">
            <Form.Label>Specialization Category</Form.Label>
            <Form.Select value={selectedCategory} onChange={handleCategoryChange} required>
              <option value="">-- Select Category --</option>
              {Object.keys(doctorSpecializations).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
              ))}
            </Form.Select>
          </Form.Group>

          {selectedCategory && (
              <Form.Group className="mb-3">
                <Form.Label>Specialization</Form.Label>
                <Form.Select name="specialization" value={formData.specialization} onChange={handleChange} required>
                  <option value="">-- Select Specialization --</option>
                  {doctorSpecializations[selectedCategory].map((spec) => (
                      <option key={spec} value={spec}>{spec}</option>
                  ))}
                </Form.Select>
              </Form.Group>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Experience (in years)</Form.Label>
            <Form.Control
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Qualification Category</Form.Label>
            <Form.Select
                value={qualificationCategory}
                onChange={(e) => {
                  setQualificationCategory(e.target.value);
                  setFormData({ ...formData, qualifications: "" });
                }}
                required
            >
              <option value="">-- Select Category --</option>
              {Object.keys(doctorQualifications).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
              ))}
            </Form.Select>
          </Form.Group>

          {qualificationCategory && (
              <Form.Group className="mb-3">
                <Form.Label>Qualifications</Form.Label>
                <Form.Select
                    name="qualifications"
                    value={formData.qualifications}
                    onChange={handleChange}
                    required
                >
                  <option value="">-- Select Qualification --</option>
                  {doctorQualifications[qualificationCategory].map((q) => (
                      <option key={q} value={q}>{q}</option>
                  ))}
                </Form.Select>
              </Form.Group>
          )}

          <Form.Group className="mb-3">
            <Form.Label>License Number</Form.Label>
            <Form.Control
                type="text"
                name="license"
                value={formData.license}
                onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Available Days</Form.Label>
            <Form.Control
                type="text"
                placeholder="e.g. Monday, Wednesday, Friday"
                name="availableDays"
                value={formData.availableDays}
                onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Available Time Start</Form.Label>
            <Form.Control
                type="time"
                name="availableTimeStart"
                value={formData.availableTimeStart}
                onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Available Time End</Form.Label>
            <Form.Control
                type="time"
                name="availableTimeEnd"
                value={formData.availableTimeEnd}
                onChange={handleChange}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </>
  );
}
