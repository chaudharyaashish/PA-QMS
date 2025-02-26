"use client";

import "./DailySchedule.css";

export default function DailySchedule() {
  const appointments = [
    {
      id: 1,
      time: "09:00 AM",
      patient: "John Doe",
      type: "Check-up",
      priority: "high",
      status: "scheduled",
    },
    {
      id: 2,
      time: "10:00 AM",
      patient: "Jane Smith",
      type: "Follow-up",
      priority: "medium",
      status: "completed",
    },
    {
      id: 3,
      time: "11:00 AM",
      patient: "Bob Johnson",
      type: "Consultation",
      priority: "low",
      status: "rescheduled",
    },
    {
      id: 4,
      time: "02:00 PM",
      patient: "Alice Brown",
      type: "Emergency",
      priority: "high",
      status: "scheduled",
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "high-priority";
      case "medium":
        return "medium-priority";
      case "low":
        return "low-priority";
      default:
        return "default-priority";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <span className="badge secondary">Completed</span>;
      case "rescheduled":
        return <span className="badge outline">Rescheduled</span>;
      default:
        return <span className="badge">Scheduled</span>;
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Today's Schedule</h2>
      </div>
      <div className="card-content">
        <div className="scroll-area">
          <div className="schedule-list">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="schedule-item">
                <div className="schedule-details">
                  <p className="time">{appointment.time}</p>
                  <p className="patient">{appointment.patient}</p>
                  <p className="type">{appointment.type}</p>
                </div>
                <div className="schedule-status">
                  <span
                    className={`priority-badge ${getPriorityColor(
                      appointment.priority
                    )}`}
                  >
                    {appointment.priority}
                  </span>
                  <div>{getStatusBadge(appointment.status)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
