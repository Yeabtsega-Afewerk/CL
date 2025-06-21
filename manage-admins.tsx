"use client"

import axios from "axios"
import { useState, useEffect } from "react"

interface Admin {
  _id: string
  username: string
  role: string
  class?: {
    _id: string
    name: string
  }
}

export function ManageAdmins() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [resetPasswordId, setResetPasswordId] = useState<string | null>(null)
  const [newPassword, setNewPassword] = useState("")

  useEffect(() => {
    fetchAdmins()
  }, [])

  const fetchAdmins = async () => {
    try {
      setLoading(true)
      // In a real app, you would have an endpoint to fetch admins
      // For now, we'll fetch classes and extract admin info
      const response: any = await axios.get("http://localhost:3000/classes");
      if (!response?.data) throw new Error("Failed to fetch admins")

      const classes = response?.data;
      
      setAdmins(classes)
      setError("")
    } catch (err) {
      setError("Failed to load admins. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (id: string) => {
    if (!newPassword) {
      setError("Password is required")
      return
    }

    try {
      setLoading(true)
      const response = await axios.post(`http://localhost:3000/admins/${id}`, {
          password: newPassword,
      });

      if (!response.data) throw new Error("Failed to reset password")

      setResetPasswordId(null)
      setNewPassword("")
      setError("")
      alert("Password reset successfully")
    } catch (err) {
      setError("Failed to reset password. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const removeAdmin = async (id: string) => {
    if (!confirm("Are you sure you want to remove this admin?")) return

    try {
      setLoading(true)
      const response = await axios.delete(`http://localhost:3000/admins/${id}`)

      if (!response.data) throw new Error("Failed to remove admin")

      await fetchAdmins()
      setError("")
    } catch (err) {
      setError("Failed to remove admin. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white border rounded-md p-6">
      <h2 className="text-xl font-semibold mb-1">Class Administrators</h2>
      <p className="text-gray-500 text-sm mb-4">Manage all class administrators</p>

      {error && <div className="bg-red-50 text-red-500 p-3 rounded mb-4">{error}</div>}

      {loading ? (
        <p className="text-gray-500">Loading administrators...</p>
      ) : admins.length === 0 ? (
        <p className="text-gray-500">No administrators found.</p>
      ) : (
        <div className="space-y-4">
          {admins.map((admin: any) => (
            <div key={admin._id} className="border rounded-md p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{admin.adminName}</h3>
                  <p className="text-sm text-gray-500">Class: {admin.name}</p>
                </div>
                <div className="flex gap-2">
                  {resetPasswordId === admin._id ? (
                    <div className="flex gap-2">
                      <input
                        type="password"
                        className="px-3 py-1 border rounded-md text-sm"
                        placeholder="New password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded-md text-sm"
                        onClick={() => resetPassword(admin._id)}
                        disabled={loading}
                      >
                        Save
                      </button>
                      <button
                        className="bg-gray-200 text-gray-800 px-3 py-1 rounded-md text-sm"
                        onClick={() => {
                          setResetPasswordId(null)
                          setNewPassword("")
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      className="bg-gray-200 text-gray-800 px-3 py-1 rounded-md text-sm"
                      onClick={() => setResetPasswordId(admin._id)}
                      disabled={loading}
                    >
                      Reset Password
                    </button>
                  )}
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded-md text-sm"
                    onClick={() => removeAdmin(admin._id)}
                    disabled={loading}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
