"use client"

import { useState, useEffect } from "react"

interface Student {
  _id: string
  studentId: string
  fullName: string
}

export function Attendance() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [attendanceStatus, setAttendanceStatus] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const response = await fetch("http://localhost:3000/attendance")

      if (!response.ok) {
        throw new Error("Failed to fetch students")
      }

      let data = await response.json()

      // Sort students by name
      data = data.sort((a: Student, b: Student) => a.fullName.localeCompare(b.fullName))

      setStudents(data)

      // Initialize all students as "Not Marked"
      const initialStatus: Record<string, string> = {}
      data.forEach((student: Student) => {
        initialStatus[student._id] = "Not Marked"
      })
      setAttendanceStatus(initialStatus)
    } catch (err) {
      console.error("Error fetching students for attendance:", err)
      setError("Failed to load students. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const markAttendance = async (studentId: string, status: string) => {
    try {
      setLoading(true)
      const response = await fetch("http://localhost:3000/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId,
          status,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to mark attendance")
      }

      // Update local state
      setAttendanceStatus((prev) => ({
        ...prev,
        [studentId]: status,
      }))
    } catch (err) {
      console.error("Error marking attendance:", err)
      setError("Failed to mark attendance. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg border p-6">
      <h2 className="text-xl font-semibold mb-1">Mark Attendance</h2>
      <p className="text-gray-500 text-sm mb-4">Record daily attendance for your class</p>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">{error}</div>}

      <div className="mb-6">
        <label htmlFor="date" className="block text-sm font-medium mb-1">
          Date
        </label>
        <input
          id="date"
          type="date"
          className="px-3 py-2 border rounded-md"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {loading && students.length === 0 ? (
        <p className="text-gray-500">Loading students...</p>
      ) : students.length === 0 ? (
        <p className="text-gray-500">No students found. Add students first.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium">ID</th>
                <th className="text-left py-3 px-4 font-medium">Name</th>
                <th className="text-left py-3 px-4 font-medium">Status</th>
                <th className="text-right py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id} className="border-b">
                  <td className="py-3 px-4">{student.studentId}</td>
                  <td className="py-3 px-4">{student.fullName}</td>
                  <td className="py-3 px-4">{attendanceStatus[student._id]}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded-md text-sm"
                        onClick={() => markAttendance(student._id, "Present")}
                        disabled={loading}
                      >
                        Present
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded-md text-sm"
                        onClick={() => markAttendance(student._id, "Absent")}
                        disabled={loading}
                      >
                        Absent
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
