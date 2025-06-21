import { useState, useEffect } from "react"

interface AttendanceRecord {
  _id: string
  date: string
  status: string
  day?: string
}

export default function AttendanceHistory() {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true)
        const response = await fetch("http://localhost:3000/student/attendance")

        if (!response.ok) {
          throw new Error("Failed to fetch attendance data")
        }

        const data = await response.json()

        // Add day of week to each record
        const recordsWithDay = data.records.map((record: AttendanceRecord) => {
          const date = new Date(record.date)
          const dayOfWeek = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(date)
          return {
            ...record,
            day: dayOfWeek,
            // Format date as YYYY-MM-DD
            date: date.toISOString().split("T")[0],
          }
        })

        // Sort by date (newest first)
        recordsWithDay.sort(
          (a: AttendanceRecord, b: AttendanceRecord) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        )

        setAttendanceRecords(recordsWithDay)
      } catch (err) {
        console.error("Error fetching attendance:", err)
        setError("Could not load attendance records")
      } finally {
        setLoading(false)
      }
    }

    fetchAttendance()
  }, [])

  if (loading) {
    return (
      <div className="bg-white border rounded-md p-6">
        <h2 className="text-xl font-semibold mb-1">Attendance History</h2>
        <p className="text-gray-500 mt-4">Loading attendance records...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white border rounded-md p-6">
        <h2 className="text-xl font-semibold mb-1">Attendance History</h2>
        <p className="text-red-500 mt-4">{error}</p>
      </div>
    )
  }

  return (
    <div className="bg-white border rounded-md p-6">
      <h2 className="text-xl font-semibold mb-1">Attendance History</h2>
      <p className="text-gray-500 text-sm mb-4">Your attendance record for the current term</p>

      {attendanceRecords.length === 0 ? (
        <p className="text-gray-500">No attendance records found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium">Date</th>
                <th className="text-left py-3 px-4 font-medium">Day</th>
                <th className="text-left py-3 px-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceRecords.map((record) => (
                <tr key={record._id} className="border-b">
                  <td className="py-3 px-4">{record.date}</td>
                  <td className="py-3 px-4">{record.day}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        record.status === "present" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </span>
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
