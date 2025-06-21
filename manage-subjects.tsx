"use client"

import axios from "axios"
import type React from "react"

import { useState, useEffect } from "react"

interface Subject {
  _id: string
  name: string
  code: string
}

export function ManageSubjects() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [subjectName, setSubjectName] = useState("")
  const [subjectCode, setSubjectCode] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    fetchSubjects()
  }, [])

  const fetchSubjects = async () => {
    try {
      setLoading(true)
      const response: any = await axios.get("http://localhost:3000/subjects")
      if (!response.data) throw new Error("Failed to fetch subjects")

      setSubjects(response.data)
      setError("")
    } catch (err) {
      setError("Failed to load subjects. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const addSubject = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!subjectName || !subjectCode) {
      setError("All fields are required")
      return
    }

    try {
      setLoading(true)
      const response = await axios.post("http://localhost:3000/subjects", {
          name: subjectName,
          code: subjectCode,
      })

      if (!response.data) throw new Error("Failed to create subject")

      await fetchSubjects()
      setSubjectName("")
      setSubjectCode("")
      setError("")
    } catch (err) {
      setError("Failed to create subject. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const deleteSubject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subject?")) return

    try {
      setLoading(true)
      const response = await axios.delete(`http://localhost:3000/subjects/${id}`);

      if (!response.data) throw new Error("Failed to delete subject")

      await fetchSubjects()
      setError("")
    } catch (err) {
      setError("Failed to delete subject. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="bg-white border rounded-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-1">Add New Subject</h2>
        <p className="text-gray-500 text-sm mb-4">Create a new subject for class timetables</p>

        {error && <div className="bg-red-50 text-red-500 p-3 rounded mb-4">{error}</div>}

        <form onSubmit={addSubject}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Subject Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="e.g. Mathematics"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subject Code</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="e.g. MATH101"
                value={subjectCode}
                onChange={(e) => setSubjectCode(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <button type="submit" className="bg-black text-white px-4 py-2 rounded-md font-medium" disabled={loading}>
            {loading ? "Adding..." : "Add Subject"}
          </button>
        </form>
      </div>

      <div className="bg-white border rounded-md p-6">
        <h2 className="text-xl font-semibold mb-1">Existing Subjects</h2>
        <p className="text-gray-500 text-sm mb-4">Manage your existing subjects</p>

        {loading ? (
          <p className="text-gray-500">Loading subjects...</p>
        ) : subjects.length === 0 ? (
          <p className="text-gray-500">No subjects found. Create your first subject above.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Subject Name</th>
                  <th className="text-left py-3 px-4 font-medium">Subject Code</th>
                  <th className="text-right py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subject) => (
                  <tr key={subject._id} className="border-b">
                    <td className="py-3 px-4">{subject.name}</td>
                    <td className="py-3 px-4">{subject.code}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded-md text-sm ml-2"
                        onClick={() => deleteSubject(subject._id)}
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
