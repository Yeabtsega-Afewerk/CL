"use client"

import type React from "react"

import { useState, useEffect } from "react"

interface Student {
  _id: string
  studentId: string
  fullName: string
  email: string
}

export function Students() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Form state
  const [studentId, setStudentId] = useState("")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      setLoading(true)
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
    } finally {
      setLoading(false)
    }
  }

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!studentId || !fullName || !email || !password) {
      setError("All fields are required")
      return
    }

    try {
      setLoading(true)
      const response = await fetch("http://localhost:3000/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId,
          fullName,
          email,
          password,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add student")
      }

      // Reset form
      setStudentId("")
      setFullName("")
      setEmail("")
      setPassword("")

      // Refresh student list
      await fetchStudents()
    } catch (err) {
      console.error("Error adding student:", err)
      setError("Failed to add student. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteStudent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student?")) {
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`http://localhost:3000/students/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete student")
      }

      // Refresh student list
      await fetchStudents()
    } catch (err) {
      console.error("Error deleting student:", err)
      setError("Failed to delete student. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Add New Student Form */}
      <div className="bg-white rounded-lg border p-6 mb-6">
        <h2 className="text-xl font-semibold mb-1">Add New Student</h2>
        <p className="text-gray-500 text-sm mb-4">Add a new student to your class</p>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">{error}</div>}

        <form onSubmit={handleAddStudent}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="studentId" className="block text-sm font-medium mb-1">
                Student ID
              </label>
              <input
                id="studentId"
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="e.g. S004"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="fullName" className="block text-sm font-medium mb-1">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="e.g. John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="e.g. john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Set a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="bg-black text-white px-4 py-2 rounded-md font-medium" disabled={loading}>
            Add Student
          </button>
        </form>
      </div>

      {/* Student List */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-1">Student List</h2>
        <p className="text-gray-500 text-sm mb-4">Manage students in your class</p>

        {loading && students.length === 0 ? (
          <p className="text-gray-500">Loading students...</p>
        ) : students.length === 0 ? (
          <p className="text-gray-500">No students found. Add your first student above.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">ID</th>
                  <th className="text-left py-3 px-4 font-medium">Name</th>
                  <th className="text-left py-3 px-4 font-medium">Email</th>
                  <th className="text-right py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id} className="border-b">
                    <td className="py-3 px-4">{student.studentId}</td>
                    <td className="py-3 px-4">{student.fullName}</td>
                    <td className="py-3 px-4">{student.email}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded-md text-sm"
                        onClick={() => handleDeleteStudent(student._id)}
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </td>
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
