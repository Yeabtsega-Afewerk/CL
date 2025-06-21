"use client"

import axios from "axios"
import type React from "react"

import { useState, useEffect } from "react"

interface Class {
  _id: string
  name: string
  adminId: string
  admin?: {
    _id: string
    username: string
  }
}

export function ManageClasses() {
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(true)
  const [className, setClassName] = useState("")
  const [adminUsername, setAdminUsername] = useState("")
  const [adminPassword, setAdminPassword] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    try {
      setLoading(true)
      const response: any = await axios.get("http://localhost:3000/classes");
      if (!response.data) throw new Error("Failed to fetch classes")

      setClasses(response.data)
      setError("")
    } catch (err) {
      setError("Failed to load classes. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const addClass = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!className || !adminUsername || !adminPassword) {
      setError("All fields are required")
      return
    }

    try {
      setLoading(true)
      const response = await axios.post("http://localhost:3000/classes", {
        name: className,
        adminUsername,
        adminPassword,
      });

      if (!response.data) throw new Error("Failed to create class")

      await fetchClasses()
      setClassName("")
      setAdminUsername("")
      setAdminPassword("")
      setError("")
    } catch (err) {
      setError("Failed to create class. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const deleteClass = async (id: string) => {
    if (!confirm("Are you sure you want to delete this class?")) return

    try {
      setLoading(true)

      const response = await axios.delete(`http://localhost:3000/classes/${id}`)

      if (!response.data) throw new Error("Failed to delete class")

      await fetchClasses()
      setError("")
    } catch (err) {
      setError("Failed to delete class. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="bg-white border rounded-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-1">Add New Class</h2>
        <p className="text-gray-500 text-sm mb-4">Create a new class and assign an administrator</p>

        {error && <div className="bg-red-50 text-red-500 p-3 rounded mb-4">{error}</div>}

        <form onSubmit={addClass}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Class Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="e.g. Class 10-A"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Admin Username</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="e.g. admin10A"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Admin Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Set a secure password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button type="submit" className="bg-black text-white px-4 py-2 rounded-md font-medium" disabled={loading}>
            {loading ? "Adding..." : "Add Class"}
          </button>
        </form>
      </div>

      <div className="bg-white border rounded-md p-6">
        <h2 className="text-xl font-semibold mb-1">Existing Classes</h2>
        <p className="text-gray-500 text-sm mb-4">Manage your existing classes and their administrators</p>

        {loading ? (
          <p className="text-gray-500">Loading classes...</p>
        ) : classes.length === 0 ? (
          <p className="text-gray-500">No classes found. Create your first class above.</p>
        ) : (
          <div className="space-y-4">
            {classes.map((cls: any) => (
              <div key={cls._id} className="border rounded-md p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{cls.name}</h3>
                    <p className="text-sm text-gray-500">Admin: {cls.adminName}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded-md text-sm"
                      onClick={() => deleteClass(cls._id)}
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
