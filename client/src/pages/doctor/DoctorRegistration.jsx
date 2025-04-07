import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { API_URL } from "../../config";

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
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
        {
          specialization: formData.specialization,
          experience: formData.experience,
          qualifications: formData.qualifications,
          availableDays: formData.availableDays,
          availableTimeStart: formData.availableTimeStart,
          availableTimeEnd: formData.availableTimeEnd,
          license: formData.license,
        },
        config
      );

      console.log(response);
      alert(response.data.message);
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <>
      <h1>Verify Details</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Specialization</Form.Label>
          <Form.Control
            type="text"
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
          />
        </Form.Group>

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
          <Form.Label>Qualifications</Form.Label>
          <Form.Control
            type="text"
            name="qualifications"
            value={formData.qualifications}
            onChange={handleChange}
          />
        </Form.Group>
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
