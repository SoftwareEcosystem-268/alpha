'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'
import DealCard, { Deal } from '@/components/DealCard'

export default function FavoritesPage() {
  const router = useRouter()
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [favoriteDeals, setFavoriteDeals] = useState<Deal[]>([])
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [sortBy, setSortBy] = useState<'newest' | 'savings' | 'expiring'>('newest')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem('user')

    if (!userData) {
      router.push('/login')
      return
    }

    setUser(JSON.parse(userData))
    fetchFavoritesAndDeals()
  }, [router])

  const fetchFavoritesAndDeals = async () => {
    try {
      // Fetch favorites from API
      const favResponse = await fetch('/api/user/favorites')
      const favData = await favResponse.json()
      const favoriteIds = favData.success && favData.favorites ? favData.favorites : []

      // Fetch all deals
      const dealsResponse = await fetch('/api/deals')
      const dealsData = await dealsResponse.json()
      const allDeals = dealsData.success ? dealsData.deals : []

      // Filter favorite deals
      const favDeals = allDeals.filter((deal: Deal) => favoriteIds.includes(deal.id))
      setFavoriteDeals(favDeals)
      setFavorites(new Set(favoriteIds))
    } catch (error) {
      console.error('Failed to fetch favorites:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleFavorite = async (dealId: string) => {
    const newFavorites = new Set(favorites)
    const isAdding = !newFavorites.has(dealId)

    // Update local state
    if (isAdding) {
      newFavorites.add(dealId)
    } else {
      newFavorites.delete(dealId)
    }
    setFavorites(newFavorites)
    localStorage.setItem('favorites', JSON.stringify([...newFavorites]))

    // Update in database (cookies handle auth automatically)
    try {
      await fetch('/api/user/favorites', {
        method: isAdding ? 'POST' : 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dealId }),
      })
    } catch (error) {
      console.error('Failed to update favorites:', error)
    }

    // Update favorite deals list
    const updatedDeals = favoriteDeals.filter(deal => newFavorites.has(deal.id))
    setFavoriteDeals(updatedDeals)
  }

  const sortedDeals = [...favoriteDeals].sort((a, b) => {
    switch (sortBy) {
      case 'savings':
        const savingsA = a.originalPrice - a.discountedPrice
        const savingsB = b.originalPrice - b.discountedPrice
        return savingsB - savingsA
      case 'expiring':
        if (!a.expiresAt) return 1
        if (!b.expiresAt) return -1
        return new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime()
      default:
        return 0
    }
  })

  const totalSavings = favoriteDeals.reduce(
    (sum, deal) => sum + (deal.originalPrice - deal.discountedPrice),
    0
  )

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
          <p className="text-gray-600">Loading favorites...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation isAuthenticated={!!user} userName={user?.name} />

      {/* Header */}
      <div className="pt-24 pb-8 px-4 bg-gradient-to-br from-primary-50 via-white to-primary-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
              <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-900">My Favorites</h1>
          </div>
          <p className="text-gray-600 text-lg">Your saved deals in one place</p>

          {/* Stats */}
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="bg-white rounded-xl px-6 py-4 shadow-soft">
              <div className="text-3xl font-bold text-primary">{favoriteDeals.length}</div>
              <div className="text-sm text-gray-600">Saved Deals</div>
            </div>
            <div className="bg-white rounded-xl px-6 py-4 shadow-soft">
              <div className="text-3xl font-bold text-primary">${totalSavings.toFixed(0)}</div>
              <div className="text-sm text-gray-600">Total Potential Savings</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sort Bar */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-soft">
          <span className="text-gray-700 font-medium">Sort by:</span>
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy('newest')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                sortBy === 'newest'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Newest
            </button>
            <button
              onClick={() => setSortBy('savings')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                sortBy === 'savings'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Biggest Savings
            </button>
            <button
              onClick={() => setSortBy('expiring')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                sortBy === 'expiring'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Expiring Soon
            </button>
          </div>
        </div>
      </div>

      {/* Deals Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        {sortedDeals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedDeals.map(deal => (
              <DealCard
                key={deal.id}
                deal={{ ...deal, isFavorite: true }}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No favorites yet</h3>
            <p className="text-gray-600 mb-6">Start saving deals you love by clicking the heart icon</p>
            <button
              onClick={() => router.push('/deals')}
              className="btn-primary"
            >
              Browse Deals
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
