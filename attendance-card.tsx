import { useState, useEffect } from "react"

interface AttendanceData {
  percent: number
  records: {
    _id: string
    date: string
    status: string
  }[]
}

export default function AttendanceCard() {
  const [attendance, setAttendance] = useState<AttendanceData | null>(null)
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
        setAttendance(data)
      } catch (err) {
        console.error("Error fetching attendance:", err)
        setError("Could not load attendance information")
      } finally {
        setLoading(false)
      }
    }

    fetchAttendance()
  }, [])

  if (loading) {
    return (
      <div className="bg-white border rounded-md p-6 h-full flex items-center justify-center">
        <p className="text-gray-500">Loading attendance data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white border rounded-md p-6 h-full">
        <h2 className="text-xl font-semibold mb-1">Attendance</h2>
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  // Calculate present days
  const presentDays = attendance?.records.filter((record) => record.status === "present").length || 0
  const totalDays = attendance?.records.length || 0

  return (
    <div className="bg-white border rounded-md p-6 h-full">
      <h2 className="text-xl font-semibold mb-4">Attendance</h2>

      {attendance ? (
        <div>
          <h3 className="text-3xl font-bold mb-2">{Math.round(attendance.percent)}%</h3>
          <p className="text-gray-600">
            Present {presentDays} out of {totalDays} days
          </p>
        </div>
      ) : (
        <p className="text-gray-500">No attendance data available</p>
      )}
    </div>
  )
}
