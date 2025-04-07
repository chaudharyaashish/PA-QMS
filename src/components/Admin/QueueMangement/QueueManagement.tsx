import { useState } from "react"
import { Bell, Filter, MoreVertical, ChevronDown } from "lucide-react"
import { AddPatientDialog } from "../AddPatient/add-patient"
import Header from "../header/Header"
import Sidebar from "../sidebar/Sidebar"

// Define types
type Patient = {
  id: string
  name: string
  arrivalTime: string
  waitTime: string
  waitMinutes: number
  assignedDoctor: string | null
  priority: "Normal" | "Urgent" | "Low"
  status: "Waiting" | "In Consultation" | "Just Arrived"
}

export default function QueueManagement() {
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: "P-1001",
      name: "John Doe",
      arrivalTime: "9:30 AM",
      waitTime: "32 min",
      waitMinutes: 32,
      assignedDoctor: "Dr. Smith",
      priority: "Normal",
      status: "Waiting",
    },
    {
      id: "P-1002",
      name: "Jane Doe",
      arrivalTime: "9:45 AM",
      waitTime: "18 min",
      waitMinutes: 18,
      assignedDoctor: "Dr. Brown",
      priority: "Urgent",
      status: "In Consultation",
    },
    {
      id: "P-1003",
      name: "Mike Johnson",
      arrivalTime: "10:00 AM",
      waitTime: "5 min",
      waitMinutes: 5,
      assignedDoctor: "Dr. White",
      priority: "Normal",
      status: "Waiting",
    },
    {
      id: "P-1004",
      name: "Sarah Williams",
      arrivalTime: "10:15 AM",
      waitTime: "0 min",
      waitMinutes: 0,
      assignedDoctor: null,
      priority: "Low",
      status: "Just Arrived",
    },
    {
      id: "P-1005",
      name: "Robert Brown",
      arrivalTime: "9:15 AM",
      waitTime: "45 min",
      waitMinutes: 45,
      assignedDoctor: "Dr. Smith",
      priority: "Urgent",
      status: "Waiting",
    },
  ])

  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const waitingPatients = patients.filter(
    (patient) => patient.status === "Waiting" || patient.status === "Just Arrived",
  )

  const completedPatients = patients.filter((patient) => patient.status === "In Consultation")

  const averageWaitTime = Math.round(
    waitingPatients.reduce((acc, patient) => acc + patient.waitMinutes, 0) / (waitingPatients.length || 1),
  )

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const addPatient = (newPatient: Patient) => {
    setPatients([...patients, newPatient])
  }

  const assignDoctor = (patientId: string, doctor: string) => {
    setPatients(
      patients.map((patient) => (patient.id === patientId ? { ...patient, assignedDoctor: doctor } : patient)),
    )
  }

  return (
    <>
      <Header />
      <div className="flex">
        <Sidebar />
        <div className="container mx-auto py-6 max-w-7xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-blue-600">Queue Management</h1>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Bell className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-sm font-medium text-gray-500 mb-2">Waiting Patients</h2>
              <p className="text-xl font-bold mb-2">Current patients waiting: {waitingPatients.length}</p>
              <div className="w-full bg-blue-100 rounded-full h-2.5">
                <div
                  className="bg-blue-500 h-2.5 rounded-full"
                  style={{ width: `${(waitingPatients.length / 20) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-sm font-medium text-gray-500 mb-2">Average Wait Time</h2>
              <p className="text-xl font-bold mb-2">{averageWaitTime} minutes</p>
              <div className="w-full bg-amber-100 rounded-full h-2.5">
                <div
                  className="bg-amber-500 h-2.5 rounded-full"
                  style={{ width: `${(averageWaitTime / 60) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-sm font-medium text-gray-500 mb-2">Completed Today</h2>
              <p className="text-xl font-bold mb-2">{completedPatients.length} patients</p>
              <div className="w-full bg-green-100 rounded-full h-2.5">
                <div
                  className="bg-green-500 h-2.5 rounded-full"
                  style={{ width: `${(completedPatients.length / 20) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="w-full">
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-white border rounded-lg">Current Queue</button>
                <button className="px-4 py-2 bg-white border rounded-lg">Completed</button>
              </div>

              <div className="flex gap-2">
                <input
                  type="search"
                  placeholder="Search patients..."
                  className="w-[250px] p-2 border rounded-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="p-2 border rounded-lg">
                  <Filter className="h-4 w-4" />
                </button>
                <button
                  className="p-2 bg-blue-500 text-white rounded-lg"
                  onClick={() => setIsAddPatientOpen(true)}
                >
                  <span className="mr-1">+</span> Add Patient
                </button>
              </div>
            </div>

            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-3 text-left">Patient Name</th>
                    <th className="p-3 text-left">Patient ID</th>
                    <th className="p-3 text-left">Arrival Time</th>
                    <th className="p-3 text-left">Wait Time</th>
                    <th className="p-3 text-left">Assigned Doctor</th>
                    <th className="p-3 text-left">Priority</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map((patient) => (
                    <tr key={patient.id} className="border-b">
                      <td className="p-3 font-medium">{patient.name}</td>
                      <td className="p-3">{patient.id}</td>
                      <td className="p-3">{patient.arrivalTime}</td>
                      <td className="p-3">{patient.waitTime}</td>
                      <td className="p-3">
                        {patient.assignedDoctor ? (
                          patient.assignedDoctor
                        ) : (
                          <div className="relative">
                            <button className="p-2 border rounded-lg flex items-center">
                              Assign Doctor <ChevronDown className="ml-1 h-4 w-4" />
                            </button>
                            <div className="absolute bg-white border rounded-lg shadow mt-1">
                              <button
                                className="block w-full p-2 text-left hover:bg-gray-100"
                                onClick={() => assignDoctor(patient.id, "Dr. Smith")}
                              >
                                Dr. Smith
                              </button>
                              <button
                                className="block w-full p-2 text-left hover:bg-gray-100"
                                onClick={() => assignDoctor(patient.id, "Dr. Brown")}
                              >
                                Dr. Brown
                              </button>
                              <button
                                className="block w-full p-2 text-left hover:bg-gray-100"
                                onClick={() => assignDoctor(patient.id, "Dr. White")}
                              >
                                Dr. White
                              </button>
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-full text-sm ${patient.priority === "Urgent"
                              ? "bg-red-100 text-red-700"
                              : patient.priority === "Low"
                                ? "bg-gray-100 text-gray-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                        >
                          {patient.priority}
                        </span>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-full text-sm ${patient.status === "In Consultation"
                              ? "bg-gray-100 text-gray-700"
                              : patient.status === "Waiting"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-slate-100 text-slate-700"
                            }`}
                        >
                          {patient.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <AddPatientDialog
            open={isAddPatientOpen}
            onOpenChange={setIsAddPatientOpen}
            onAddPatient={addPatient}
            patientCount={patients.length}
          />
        </div>
      </div>
    </>
  )
}