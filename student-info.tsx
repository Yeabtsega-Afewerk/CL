import { useState, useEffect } from "react"

interface StudentData {
  _id: string
  name: string
  class: string
  rollNo: string
}

export default function StudentInfo() {
  const [student, setStudent] = useState<StudentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchStudentInfo = async () => {
      try {
        setLoading(true)
        const response = await fetch("http://localhost:3000/student/info")

        if (!response.ok) {
          throw new Error("Failed to fetch student information")
        }

        const data = await response.json()
        setStudent(data)
      } catch (err) {
        console.error("Error fetching student info:", err)
        setError("Could not load student information")
      } finally {
        setLoading(false)
      }
    }

    fetchStudentInfo()
  }, [])

  if (loading) {
    return (
      <div className="bg-white border rounded-md p-6 h-full flex items-center justify-center">
        <p className="text-gray-500">Loading student information...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white border rounded-md p-6 h-full">
        <h2 className="text-xl font-semibold mb-1">Student Info</h2>
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="bg-white border rounded-md p-6 h-full">
      <h2 className="text-xl font-semibold mb-4">Student Info</h2>

      {student ? (
        <div>
          <h3 className="text-3xl font-bold mb-2">{student.name}</h3>
          <p className="text-gray-600">
            Class {student.class} | Roll No: {student.rollNo}
          </p>
        </div>
      ) : (
        <p className="text-gray-500">No student information available</p>
      )}
    </div>
  )
}
