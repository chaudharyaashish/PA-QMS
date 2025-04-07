import { Bell } from "lucide-react";
import Header from "../header/Header";
import { Sidebar } from "../sidebar/Sidebar";

// Sample data for the dashboard
const dashboardData = {
  patientQueue: {
    count: 5,
    percentage: 25, // Percentage for progress bar
  },
  doctorAvailability: {
    count: 3,
    percentage: 60, // Percentage for progress bar
  },
  revenue: {
    amount: "$15,000",
    label: "This Month",
    percentage: 75, // Percentage for progress bar
  },
  recentAppointments: [
    {
      patientName: "John Doe",
      doctor: "Dr. Smith",
      time: "10:00 AM",
      status: "Scheduled",
    },
    {
      patientName: "Jane Doe",
      doctor: "Dr. Brown",
      time: "10:30 AM",
      status: "Checked In",
    },
    {
      patientName: "Mike Johnson",
      doctor: "Dr. White",
      time: "11:00 AM",
      status: "Completed",
    },
  ],
};

export default function Dashboard() {
  return (<>
    <Header />
    <div className="flex">

      <Sidebar />
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-600">Dashboard</h1>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Bell className="h-5 w-5" />
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Patient Queue Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-sm font-medium text-blue-600 mb-1">Patient Queue</h2>
            <p className="text-base mb-2">Current patients in queue: {dashboardData.patientQueue.count}</p>
            <div className="w-full bg-green-100 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${dashboardData.patientQueue.percentage}%` }}
              ></div>
            </div>
          </div>

          {/* Doctor Availability Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-sm font-medium text-blue-600 mb-1">Doctor Availability</h2>
            <p className="text-base mb-2">Available doctors: {dashboardData.doctorAvailability.count}</p>
            <div className="w-full bg-green-100 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${dashboardData.doctorAvailability.percentage}%` }}
              ></div>
            </div>
          </div>

          {/* Revenue Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-sm font-medium text-blue-600 mb-1">Revenue</h2>
            <p className="text-base mb-2">
              {dashboardData.revenue.amount} {dashboardData.revenue.label}
            </p>
            <div className="w-full bg-green-100 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${dashboardData.revenue.percentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Recent Appointments Table */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-blue-600 mb-4">Recent Appointments</h2>
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-3 text-left">Patient Name</th>
                  <th className="p-3 text-left">Doctor</th>
                  <th className="p-3 text-left">Time</th>
                  <th className="p-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.recentAppointments.map((appointment, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-3 font-medium">{appointment.patientName}</td>
                    <td className="p-3">{appointment.doctor}</td>
                    <td className="p-3">{appointment.time}</td>
                    <td className="p-3 text-right">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${appointment.status === "Scheduled"
                          ? "bg-blue-50 text-blue-700"
                          : appointment.status === "Checked In"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-green-50 text-green-700"
                          }`}
                      >
                        {appointment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </>
  );
}