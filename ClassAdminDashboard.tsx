 "use client"

import { useState } from "react"
import { Students } from "./components/students"
import { Attendance } from "./components/attendance"
import { Marks } from "./components/marks"


export default function ClassAdminDashboard() {
  const [activeTab, setActiveTab] = useState<"students" | "attendance" | "marks">("students")

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-medium">Student Management System</h1>
            <span className="text-gray-500">/</span>
            <span className="text-gray-500">Class Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm">Class Admin</span>
            <button className="p-1 rounded border cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Class Admin Dashboard</h1>

        <div className="mb-6">
          <div className="flex border-b">
            <button
              className={`px-4 py-2 font-medium ${activeTab === "students" ? "border-b-2 border-black" : "text-gray-500"}`}
              onClick={() => setActiveTab("students")}
            >
              Students
            </button>
            <button
              className={`px-4 py-2 font-medium ${activeTab === "attendance" ? "border-b-2 border-black" : "text-gray-500"}`}
              onClick={() => setActiveTab("attendance")}
            >
              Attendance
            </button>
            <button
              className={`px-4 py-2 font-medium ${activeTab === "marks" ? "border-b-2 border-black" : "text-gray-500"}`}
              onClick={() => setActiveTab("marks")}
            >
              Marks
            </button>
          </div>
        </div>

        {activeTab === "students" && <Students />}
        {activeTab === "attendance" && <Attendance />}
        {activeTab === "marks" && <Marks />}
      </main>

      <footer className="border-t mt-auto bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between text-sm text-gray-500">
          <p>© 2025 Student Management System</p>
          <p>Version 1.0.0</p>
        </div>
      </footer>
    </div>
  )
}
