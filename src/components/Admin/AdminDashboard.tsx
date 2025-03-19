import Sidebar from "../../components/Admin/sidebar/Sidebar";
import Header from "../../components/Admin/header/Header";
import "./admin.css";

export default function AdminDashboard() {
  return (
    <div className="dashboard-container">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content */}
      <div className="main-content">
        {/* Header Component */}
        <Header />

        <main className="dashboard-main">
          {/* Stats Cards */}
          <div className="stats-cards">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Patient Queue</h3>
              </div>
              <div className="card-content">
                <div className="card-value">5</div>
                <p className="card-description">Current patients in queue</p>
              </div>
            </div>
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Doctor Availability</h3>
              </div>
              <div className="card-content">
                <div className="card-value">3</div>
                <p className="card-description">Available doctors</p>
              </div>
            </div>
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Revenue</h3>
              </div>
              <div className="card-content">
                <div className="card-value">$15,000</div>
                <p className="card-description">This Month</p>
              </div>
            </div>
          </div>

          {/* Recent Appointments Table */}
          <div className="appointments-table">
            <div className="table-container">
              <h3 className="table-title">Recent Appointments</h3>
              <table>
                <thead>
                  <tr>
                    <th>Patient Name</th>
                    <th>Doctor</th>
                    <th>Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>John Doe</td>
                    <td>Dr. Smith</td>
                    <td>10:00 AM</td>
                    <td>
                      <span className="status scheduled">Scheduled</span>
                    </td>
                  </tr>
                  <tr>
                    <td>Jane Doe</td>
                    <td>Dr. Brown</td>
                    <td>10:30 AM</td>
                    <td>
                      <span className="status checked-in">Checked In</span>
                    </td>
                  </tr>
                  <tr>
                    <td>Mike Johnson</td>
                    <td>Dr. White</td>
                    <td>11:00 AM</td>
                    <td>
                      <span className="status completed">Completed</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
