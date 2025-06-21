import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      const response: any = await axios.post("http://localhost:3000/login", {
        username,
        password,
      });

      console.log(response?.data?.data)

      if (response?.data?.data) {
        if (response?.data?.data?.role === "superadmin") {
          navigate("/admin-dashboard")
        } else if (response?.data?.data?.role === "admin") {
          navigate("/class-admin-dashboard")
        } else if (response?.data?.data?.role === "student") {
          navigate("/student-dashboard")
        }
      } else {
        alert("Login failed")
      }
    } catch (err) {
      alert("Login failed")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">Super Admin Login</h2>
          <p className="text-gray-500 mt-1">Enter your credentials to access your account</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-medium">
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
            />
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-black hover:bg-gray-800 text-white py-2 px-4 rounded-md transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  )
}
