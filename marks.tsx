"use client"

import type React from "react"

import { useState, useEffect } from "react"

interface Student {
  _id: string
  studentId: string
  fullName: string
}

interface Subject {
  _id: string
  name: string
}

interface Mark {
  _id: string
  studentId: {
    _id: string
    fullName: string
    studentId: string
  }
  subjectId: {
    _id: string
    name: string
  }
  mark: number
}

export function Marks() {
  const [students, setStudents] = useState<Student[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [marks, setMarks] = useState<Mark[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Form state
  const [selectedStudent, setSelectedStudent] = useState("")
  const [subject, setSubject] = useState("")
  const [markObtained, setMarkObtained] = useState("")
  const [maxMarks, setMaxMarks] = useState("100")

  useEffect(() => {
    fetchStudents()
    fetchMarks()
    // In a real app, you would also fetch subjects
    // For now, we'll use dummy data
    setSubjects([
      { _id: "1", name: "Mathematics" },
      { _id: "2", name: "Science" },
      { _id: "3", name: "English" },
      { _id: "4", name: "History" },
    ])
  }, [])

  const fetchStudents = async () => {
    try {
      const response = await fetch("http://localhost:3000/students")

      if (!response.ok) {
        throw new Error("Failed to fetch students")
      }

      let data = await response.json()

      // Sort students by name
      data = data.sort((a: Student, b: Student) => a.fullName.localeCompare(b.fullName))

      setStudents(data)
    } catch (err) {
      console.error("Error fetching students:", err)
      setError("Failed to load students. Please try again.")
    }
  }

  const fetchMarks = async () => {
    try {
      setLoading(true)
      const response = await fetch("http://localhost:3000/marks")

      if (!response.ok) {
        throw new Error("Failed to fetch marks")
      }

      const data = await response.json()
      setMarks(data)
    } catch (err) {
      console.error("Error fetching marks:", err)
      setError("Failed to load marks. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleAddMark = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedStudent || !subject || !markObtained) {
      setError("All fields are required")
      return
    }

    try {
      setLoading(true)
      const response = await fetch("http://localhost:3000/marks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: selectedStudent,
          subjectId: subject,
          mark: Number.parseInt(markObtained),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add mark")
      }

      // Reset form
      setSelectedStudent("")
      setSubject("")
      setMarkObtained("")

      // Refresh marks list
      await fetchMarks()
    } catch (err) {
      console.error("Error adding mark:", err)
      setError("Failed to add mark. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Add/Update Marks Form */}
      <div className="bg-white rounded-lg border p-6 mb-6">
        <h2 className="text-xl font-semibold mb-1">Add/Update Marks</h2>
        <p className="text-gray-500 text-sm mb-4">Record academic performance for students</p>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">{error}</div>}

        <form onSubmit={handleAddMark}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="student" className="block text-sm font-medium mb-1">
                Student
              </label>
              <select
                id="student"
                className="w-full px-3 py-2 border rounded-md"
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
              >
                <option value="">Select Student</option>
                {students.map((student) => (
                  <option key={student._id} value={student._id}>
                    {student.fullName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-1">
                Subject
              </label>
              <input
                id="subject"
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="e.g. Mathematics"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="markObtained" className="block text-sm font-medium mb-1">
                Marks Obtained
              </label>
              <input
                id="markObtained"
                type="number"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="e.g. 85"
                value={markObtained}
                onChange={(e) => setMarkObtained(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="maxMarks" className="block text-sm font-medium mb-1">
                Maximum Marks
              </label>
              <input
                id="maxMarks"
                type="number"
                className="w-full px-3 py-2 border rounded-md"
                value={maxMarks}
                onChange={(e) => setMaxMarks(e.target.value)}
                readOnly
              />
            </div>
          </div>

          <button type="submit" className="bg-black text-white px-4 py-2 rounded-md font-medium" disabled={loading}>
            Save Marks
          </button>
        </form>
      </div>

      {/* Marks Records */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-1">Marks Records</h2>
        <p className="text-gray-500 text-sm mb-4">View and manage academic records</p>

        {loading && marks.length === 0 ? (
          <p className="text-gray-500">Loading marks...</p>
        ) : marks.length === 0 ? (
          <p className="text-gray-500">No marks found. Add marks using the form above.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Student</th>
                  <th className="text-left py-3 px-4 font-medium">Subject</th>
                  <th className="text-left py-3 px-4 font-medium">Marks</th>
                </tr>
              </thead>
              <tbody>
                {marks.map((mark) => (
                  <tr key={mark._id} className="border-b">
                    <td className="py-3 px-4">{mark.studentId.fullName}</td>
                    <td className="py-3 px-4">{mark.subjectId.name}</td>
                    <td className="py-3 px-4">{mark.mark}/100</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
