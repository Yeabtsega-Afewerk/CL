import { useState, useEffect } from "react"

interface PerformanceData {
  average: number
  scores: {
    _id: string
    subject: string
    mark: number
    totalMark: number
  }[]
}

export default function PerformanceCard() {
  const [performance, setPerformance] = useState<PerformanceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        setLoading(true)
        const response = await fetch("http://localhost:3000/student/performance")

        if (!response.ok) {
          throw new Error("Failed to fetch performance data")
        }

        const data = await response.json()
        setPerformance(data)
      } catch (err) {
        console.error("Error fetching performance:", err)
        setError("Could not load performance information")
      } finally {
        setLoading(false)
      }
    }

    fetchPerformance()
  }, [])

  if (loading) {
    return (
      <div className="bg-white border rounded-md p-6 h-full flex items-center justify-center">
        <p className="text-gray-500">Loading performance data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white border rounded-md p-6 h-full">
        <h2 className="text-xl font-semibold mb-1">Overall Performance</h2>
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  // Calculate total marks
  const totalMarks = performance?.scores.reduce((sum, score) => sum + score.mark, 0) || 0
  const maxMarks = performance?.scores.reduce((sum, score) => sum + score.totalMark, 0) || 0
  const percentage = maxMarks > 0 ? Math.round((totalMarks / maxMarks) * 100) : 0

  return (
    <div className="bg-white border rounded-md p-6 h-full">
      <h2 className="text-xl font-semibold mb-4">Overall Performance</h2>

      {performance ? (
        <div>
          <h3 className="text-3xl font-bold mb-2">{percentage}%</h3>
          <p className="text-gray-600">
            {totalMarks} out of {maxMarks} marks
          </p>
        </div>
      ) : (
        <p className="text-gray-500">No performance data available</p>
      )}
    </div>
  )
}
