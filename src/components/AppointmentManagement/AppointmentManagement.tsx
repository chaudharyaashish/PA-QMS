import "./AppointmentManagement.css";
import { useState, useRef } from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

export default function AppointmentManagement() {
  const [date, setDate] = useState<Date>();
  const [status, setStatus] = useState("");
  const [notification, setNotification] = useState("");

  // Reference for the date input field
  const dateInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Appointment Management</h2>
      </div>
      <div className="card-content">
        <form className="form">
          {/* Appointment Date Picker */}
          <div className="form-group">
            <label>Appointment Date</label>
            <div className="date-picker">
              <button
                type="button"
                className="date-button"
                onClick={() => dateInputRef.current?.showPicker()} 
              >
                <CalendarIcon className="icon" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </button>
              <input
                type="date"
                ref={dateInputRef} 
                className="hidden-input"
                onChange={(e) => setDate(new Date(e.target.value))}
              />
            </div>
          </div>

          {/* Status Selection */}
          <div className="form-group">
            <label>Status</label>
            <select
              className="select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="" disabled>
                Select status
              </option>
              <option value="completed">Completed</option>
              <option value="rescheduled">Rescheduled</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Notification Type Selection */}
          <div className="form-group">
            <label>Notify Patient</label>
            <select
              className="select"
              value={notification}
              onChange={(e) => setNotification(e.target.value)}
            >
              <option value="" disabled>
                Select notification type
              </option>
              <option value="email">Email</option>
              <option value="sms">SMS</option>
              <option value="both">Both</option>
            </select>
          </div>

          <button type="submit" className="button">
            Update Appointment
          </button>
        </form>
      </div>
    </div>
  );
}
