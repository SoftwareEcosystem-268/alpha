'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

export default function SavingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [timePeriod, setTimePeriod] = useState<'month' | 'year' | 'all'>('year')
  const [savingsData, setSavingsData] = useState({
    totalSavings: 0,
    dealsRedeemed: 0,
    avgSavingsPerDeal: 0,
    monthlySavings: [] as { month: string; savings: number }[],
    recentRedemptions: [] as Array<{
      id: string
      dealId: string
      title: string
      storeName: string
      savings: number
      date: Date
    }>,
  })
  const [loading, setLoading] = useState(true)

  // Check authentication and fetch savings data
  useEffect(() => {
    const fetchData = async () => {
      const userData = localStorage.getItem('user')

      if (!userData) {
        router.push('/login')
        return
      }

      setUser(JSON.parse(userData))

      try {
        const response = await fetch('/api/user/savings')

        const data = await response.json()
        if (data.success) {
          setSavingsData({
            totalSavings: data.data.totalSavings,
            dealsRedeemed: data.data.dealsRedeemed,
            avgSavingsPerDeal: data.data.avgSavingsPerDeal,
            monthlySavings: data.data.monthlySavings,
            recentRedemptions: data.data.recentRedemptions.map((r: any) => ({
              ...r,
              date: new Date(r.date),
            })),
          })
        }
      } catch (error) {
        console.error('Failed to fetch savings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  // Category breakdown data (static for now - can be enhanced with API)
  const categoryData = [
    { name: 'Food', value: savingsData.totalSavings * 0.45, color: '#22C55E' },
    { name: 'Shopping', value: savingsData.totalSavings * 0.30, color: '#3B82F6' },
    { name: 'Electronics', value: savingsData.totalSavings * 0.15, color: '#F59E0B' },
    { name: 'Fitness', value: savingsData.totalSavings * 0.10, color: '#EF4444' },
  ]

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading savings data...</p>
        </div>
      </div>
    )
  }

  const { totalSavings, dealsRedeemed, avgSavingsPerDeal, monthlySavings, recentRedemptions } = savingsData

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation isAuthenticated={!!user} userName={user?.name} />

      {/* Header */}
      <div className="pt-24 pb-8 px-4 bg-gradient-to-br from-primary-50 via-white to-primary-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Savings Tracker</h1>
          </div>
          <p className="text-gray-600 text-lg">Track your savings over time</p>

          {/* Time Period Selector */}
          <div className="mt-6 inline-flex bg-white rounded-xl p-1 shadow-soft">
            <button
              onClick={() => setTimePeriod('month')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                timePeriod === 'month'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => setTimePeriod('year')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                timePeriod === 'year'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              This Year
            </button>
            <button
              onClick={() => setTimePeriod('all')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                timePeriod === 'all'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All Time
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 -mt-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600">Total Saved</span>
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="text-4xl font-bold text-primary">${totalSavings.toFixed(2)}</div>
            <div className="text-sm text-gray-500 mt-1">Lifetime savings</div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600">Deals Redeemed</span>
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="text-4xl font-bold text-blue-600">{dealsRedeemed}</div>
            <div className="text-sm text-gray-500 mt-1">Total redemptions</div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600">Avg. Savings</span>
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <div className="text-4xl font-bold text-purple-600">${avgSavingsPerDeal.toFixed(2)}</div>
            <div className="text-sm text-gray-500 mt-1">Per deal redeemed</div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Line Chart - Monthly Savings */}
          <div className="card p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Savings Over Time</h3>
            {monthlySavings.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlySavings}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    }}
                    formatter={(value: number) => [`$${value.toFixed(2)}`, 'Savings']}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="savings"
                    stroke="#22C55E"
                    strokeWidth={3}
                    dot={{ fill: '#22C55E', r: 6 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No data available yet
              </div>
            )}
          </div>

          {/* Pie Chart - Category Breakdown */}
          <div className="card p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Savings by Category</h3>
            {totalSavings > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    }}
                    formatter={(value: number) => [`$${value.toFixed(2)}`, 'Savings']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No data available yet
              </div>
            )}
          </div>
        </div>

        {/* Bar Chart - Monthly Comparison */}
        <div className="card p-6 mt-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Monthly Savings Comparison</h3>
          {monthlySavings.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlySavings}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Savings']}
                />
                <Bar dataKey="savings" fill="#22C55E" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No data available yet
            </div>
          )}
        </div>
      </div>

      {/* Recent Redemptions */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Recent Redemptions</h3>
          </div>

          {recentRedemptions.length > 0 ? (
            <div className="space-y-4">
              {recentRedemptions.map(redemption => (
                <div
                  key={redemption.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">🏷️</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate">{redemption.title}</h4>
                    <p className="text-sm text-gray-500">{redemption.storeName}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary">+${redemption.savings.toFixed(2)}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(redemption.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No redemptions yet. Start redeeming deals to track your savings!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
