'use client'

import { useState, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import DealCard, { Deal } from '@/components/DealCard'

const categories = ['All', 'Food', 'Shopping', 'Electronics', 'Fitness', 'Travel', 'Entertainment']

export default function DealsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [deals, setDeals] = useState<Deal[]>([])
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch deals from API
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await fetch('/api/deals')
        const data = await response.json()
        if (data.success) {
          setDeals(data.deals)
        }
      } catch (error) {
        console.error('Failed to fetch deals:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDeals()
  }, [])

  // Check authentication and load favorites
  useEffect(() => {
    const checkAuth = async () => {
      const userData = localStorage.getItem('user')

      if (userData) {
        setUser(JSON.parse(userData))

        // Fetch user favorites from API
        try {
          const response = await fetch('/api/user/favorites')
          const data = await response.json()
          if (data.success && data.favorites) {
            setFavorites(new Set(data.favorites))
          }
        } catch (error) {
          console.error('Failed to fetch favorites:', error)
        }
      }

      // Load favorites from localStorage as fallback
      const savedFavorites = localStorage.getItem('favorites')
      if (savedFavorites) {
        setFavorites(new Set(JSON.parse(savedFavorites)))
      }
    }

    checkAuth()
  }, [])

  const filteredDeals = deals.filter(deal => {
    const matchesSearch =
      deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.category.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory === 'All' || deal.category === selectedCategory

    return matchesSearch && matchesCategory
  })

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

    // Update deal's favorite status in local state
    setDeals(deals.map(deal =>
      deal.id === dealId ? { ...deal, isFavorite: newFavorites.has(dealId) } : deal
    ))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading deals...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation isAuthenticated={!!user} userName={user?.name} />

      {/* Header Section */}
      <div className="pt-24 pb-8 px-4 bg-gradient-to-br from-primary-50 via-white to-primary-100">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Discover Deals</h1>
          <p className="text-gray-600 text-lg">Find amazing discounts and save money on your favorite brands</p>

          {/* Search Bar */}
          <div className="mt-6 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for deals, stores, or categories..."
              className="w-full px-6 py-4 pl-14 rounded-2xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary-20 outline-none transition-all shadow-soft text-lg"
            />
            <svg
              className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Category Filters */}
          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-primary text-white shadow-soft'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <p className="text-gray-600">
          Showing <span className="font-semibold text-gray-900">{filteredDeals.length}</span> deals
        </p>
      </div>

      {/* Deals Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        {filteredDeals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDeals.map(deal => (
              <DealCard
                key={deal.id}
                deal={{ ...deal, isFavorite: favorites.has(deal.id) }}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No deals found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
