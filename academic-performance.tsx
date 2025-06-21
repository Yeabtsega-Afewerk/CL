import { useState, useEffect } from "react"

interface ScoreRecord {
  _id: string
  subject: string
  mark: number
  totalMark: number
  date?: string
}

export default function AcademicPerformance() {
  const [scores, setScores] = useState<ScoreRecord[]>([])
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

        // Sort scores by subject name
        const sortedScores = [...data.scores].sort((a: ScoreRecord, b: ScoreRecord) =>
          a.subject.localeCompare(b.subject),
        )

        setScores(sortedScores)
      } catch (err) {
        console.error("Error fetching performance:", err)
        setError("Could not load performance records")
      } finally {
        setLoading(false)
      }
    }

    fetchPerformance()
  }, [])

  if (loading) {
    return (
      <div className="bg-white border rounded-md p-6">
        <h2 className="text-xl font-semibold mb-1">Academic Performance</h2>
        <p className="text-gray-500 mt-4">Loading performance records...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white border rounded-md p-6">
        <h2 className="text-xl font-semibold mb-1">Academic Performance</h2>
        <p className="text-red-500 mt-4">{error}</p>
      </div>
    )
  }

  // Calculate average percentage
  const totalPercentage = scores.reduce((sum, score) => sum + (score.mark / score.totalMark) * 100, 0)
  const averagePercentage = scores.length > 0 ? Math.round(totalPercentage / scores.length) : 0

  return (
    <div className="bg-white border rounded-md p-6">
      <h2 className="text-xl font-semibold mb-1">Academic Performance</h2>
      <p className="text-gray-500 text-sm mb-4">Your academic performance for the current term</p>

      <div className="mb-6">
        <div className="bg-gray-100 p-4 rounded-md">
          <h3 className="font-medium mb-1">Average Score</h3>
          <p className="text-2xl font-bold">{averagePercentage}%</p>
        </div>
      </div>

      {scores.length === 0 ? (
        <p className="text-gray-500">No performance records found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium">Subject</th>
                <th className="text-left py-3 px-4 font-medium">Score</th>
                <th className="text-left py-3 px-4 font-medium">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((score) => {
                const percentage = Math.round((score.mark / score.totalMark) * 100)

                return (
                  <tr key={score._id} className="border-b">
                    <td className="py-3 px-4">{score.subject}</td>
                    <td className="py-3 px-4">
                      {score.mark} / {score.totalMark}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2 max-w-[100px]">
                          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                        </div>
                        <span>{percentage}%</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
