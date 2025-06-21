import { useState } from "react"
import { ManageClasses } from "./components/manage-classes"
import { ManageAdmins } from "./components/manage-admins"
import { ManageSubjects } from "./components/manage-subjects"
import { useNavigate } from "react-router-dom"

export default function SuperAdminDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<"classes" | "admins" | "subjects">("classes")

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-medium">Student Management System</h1>
            <span className="text-gray-500">/</span>
            <span className="text-gray-500">Super Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm">Super Admin</span>
            <button className="p-1 rounded border cursor-pointer" onClick={()=> navigate("/")}>
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
                className="lucide lucide-log-out"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6"><div>
      <h1 className="text-2xl font-bold mb-6">Super Admin Dashboard</h1>

      <div className="mb-6">
        <div className="flex border-b">
          <button
            className={`px-4 py-2 font-medium ${activeTab === "classes" ? "border-b-2 border-black" : "text-gray-500"}`}
            onClick={() => setActiveTab("classes")}
          >
            Manage Classes
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === "admins" ? "border-b-2 border-black" : "text-gray-500"}`}
            onClick={() => setActiveTab("admins")}
          >
            Manage Admins
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === "subjects" ? "border-b-2 border-black" : "text-gray-500"}`}
            onClick={() => setActiveTab("subjects")}
          >
            Manage Subjects
          </button>
        </div>
      </div>

      {activeTab === "classes" && <ManageClasses />}
      {activeTab === "admins" && <ManageAdmins />}
      {activeTab === "subjects" && <ManageSubjects />}
    </div></main>
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between text-sm text-gray-500">
          <p>© 2025 Student Management System</p>
          <p>Version 1.0.0</p>
        </div>
      </footer>
    </div>
  )
}
