import { useState } from "react"

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

interface AddPatientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddPatient: (patient: Patient) => void
  patientCount: number
}

export function AddPatientDialog({ open, onOpenChange, onAddPatient, patientCount }: AddPatientDialogProps) {
  const [name, setName] = useState("")
  const [priority, setPriority] = useState<"Normal" | "Urgent" | "Low">("Normal")
  const [doctor, setDoctor] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Get current time
    const now = new Date()
    const hours = now.getHours()
    const minutes = now.getMinutes()
    const ampm = hours >= 12 ? "PM" : "AM"
    const formattedHours = hours % 12 || 12
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes
    const arrivalTime = `${formattedHours}:${formattedMinutes} ${ampm}`

    // Create new patient
    const newPatient: Patient = {
      id: `P-${1006 + patientCount - 5}`, // Increment from the last ID
      name,
      arrivalTime,
      waitTime: "0 min",
      waitMinutes: 0,
      assignedDoctor: doctor,
      priority,
      status: "Just Arrived",
    }

    onAddPatient(newPatient)
    onOpenChange(false)

    // Reset form
    setName("")
    setPriority("Normal")
    setDoctor(null)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-[425px]">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <h2 className="text-xl font-bold">Add New Patient</h2>
            <p className="text-sm text-gray-500">
              Enter the patient details below to add them to the queue.
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label htmlFor="name" className="w-24 text-right">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 p-2 border rounded-lg"
                required
              />
            </div>
            <div className="flex items-center gap-4">
              <label htmlFor="priority" className="w-24 text-right">
                Priority
              </label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as "Normal" | "Urgent" | "Low")}
                className="flex-1 p-2 border rounded-lg"
              >
                <option value="Low">Low</option>
                <option value="Normal">Normal</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
            <div className="flex items-center gap-4">
              <label htmlFor="doctor" className="w-24 text-right">
                Doctor
              </label>
              <select
                id="doctor"
                value={doctor || ""}
                onChange={(e) => setDoctor(e.target.value || null)}
                className="flex-1 p-2 border rounded-lg"
              >
                <option value="">Assign doctor (optional)</option>
                <option value="Dr. Smith">Dr. Smith</option>
                <option value="Dr. Brown">Dr. Brown</option>
                <option value="Dr. White">Dr. White</option>
              </select>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Add Patient
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}