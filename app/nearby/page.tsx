'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import Navigation from '@/components/Navigation'
import DealCard, { Deal } from '@/components/DealCard'

// Dynamic import for map to avoid SSR issues
const MapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-gray-200 rounded-2xl flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>
  ),
})

// Mock deals with location data
const nearbyDeals: Deal[] = [
  {
    id: '1',
    title: '50% Off All Pizzas',
    description: 'Get half price on all large and medium pizzas.',
    discount: '50%',
    originalPrice: 30,
    discountedPrice: 15,
    storeName: "Domino's Pizza",
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800',
    category: 'Food',
    location: { lat: 40.7128, lng: -74.006, address: '123 Main St, New York, NY' },
    expiresAt: '2026-04-30',
  },
  {
    id: '2',
    title: '30% Off Running Shoes',
    description: 'Save big on all running shoes from top brands.',
    discount: '30%',
    originalPrice: 150,
    discountedPrice: 105,
    storeName: 'Nike Store',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
    category: 'Shopping',
    location: { lat: 40.7228, lng: -74.016, address: '456 Broadway, New York, NY' },
    expiresAt: '2026-04-15',
  },
  {
    id: '3',
    title: 'Buy 1 Get 1 Free Burgers',
    description: 'Purchase any burger and get the second one free!',
    discount: 'BOGO',
    originalPrice: 12,
    discountedPrice: 6,
    storeName: 'Burger King',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800',
    category: 'Food',
    location: { lat: 40.7028, lng: -73.996, address: '789 5th Ave, New York, NY' },
    expiresAt: '2026-04-20',
  },
  {
    id: '4',
    title: '40% Off Electronics',
    description: 'Massive savings on laptops and accessories.',
    discount: '40%',
    originalPrice: 999,
    discountedPrice: 599,
    storeName: 'Best Buy',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800',
    category: 'Electronics',
    location: { lat: 40.7328, lng: -73.986, address: '321 W 34th St, New York, NY' },
    expiresAt: '2026-04-10',
  },
  {
    id: '5',
    title: 'Free Coffee with Purchase',
    description: 'Get a free coffee when you buy any breakfast item.',
    discount: 'FREE',
    originalPrice: 5,
    discountedPrice: 0,
    storeName: 'Starbucks',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800',
    category: 'Food',
    location: { lat: 40.7428, lng: -74.026, address: '888 Madison Ave, New York, NY' },
    expiresAt: '2026-04-12',
  },
]

export default function NearbyPage() {
  const router = useRouter()
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [mapView, setMapView] = useState<'map' | 'list'>('map')

  useEffect(() => {
    // Check authentication
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }

    // Load favorites
    const savedFavorites = localStorage.getItem('favorites')
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)))
    }

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.log('Geolocation error:', error)
          // Default to New York if location not available
          setUserLocation({ lat: 40.7128, lng: -74.006 })
        }
      )
    } else {
      // Default location
      setUserLocation({ lat: 40.7128, lng: -74.006 })
    }
  }, [])

  const handleToggleFavorite = (dealId: string) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(dealId)) {
      newFavorites.delete(dealId)
    } else {
      newFavorites.add(dealId)
    }
    setFavorites(newFavorites)
    localStorage.setItem('favorites', JSON.stringify([...newFavorites]))
  }

  const dealsWithFavorite = nearbyDeals.map(deal => ({
    ...deal,
    isFavorite: favorites.has(deal.id),
  }))

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation isAuthenticated={!!user} userName={user?.name} />

      {/* Header */}
      <div className="pt-24 pb-6 px-4 bg-gradient-to-br from-primary-50 via-white to-primary-100">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Nearby Deals</h1>
          <p className="text-gray-600 text-lg">Discover amazing deals around your location</p>

          {/* View Toggle */}
          <div className="mt-6 inline-flex bg-white rounded-xl p-1 shadow-soft">
            <button
              onClick={() => setMapView('map')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                mapView === 'map'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Map View
            </button>
            <button
              onClick={() => setMapView('list')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                mapView === 'list'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              List View
            </button>
          </div>
        </div>
      </div>

      {/* Location Permission Banner */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        {userLocation ? (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span>Showing deals near your location</span>
            <button
              onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition((position) => {
                    setUserLocation({
                      lat: position.coords.latitude,
                      lng: position.coords.longitude,
                    })
                  })
                }
              }}
              className="text-primary hover:text-primary-600 font-medium ml-auto"
            >
              Update Location
            </button>
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-blue-800 text-sm">Enable location to see deals near you</span>
          </div>
        )}
      </div>

      {/* Map View */}
      {mapView === 'map' && userLocation && (
        <div className="max-w-7xl mx-auto px-4 pb-8">
          <div className="card overflow-hidden">
            <MapView
              userLocation={userLocation}
              deals={dealsWithFavorite}
              onDealClick={setSelectedDeal}
              onToggleFavorite={handleToggleFavorite}
            />
          </div>

          {/* Selected Deal Card */}
          {selectedDeal && (
            <div className="mt-6">
              <DealCard
                deal={selectedDeal}
                onToggleFavorite={handleToggleFavorite}
              />
            </div>
          )}

          {/* Stats */}
          <div className="mt-6 flex gap-4">
            <div className="flex-1 bg-white rounded-xl p-4 shadow-soft">
              <div className="text-2xl font-bold text-primary">{nearbyDeals.length}</div>
              <div className="text-sm text-gray-600">Nearby Deals</div>
            </div>
            <div className="flex-1 bg-white rounded-xl p-4 shadow-soft">
              <div className="text-2xl font-bold text-primary">
                ${nearbyDeals.reduce((sum, deal) => sum + (deal.originalPrice - deal.discountedPrice), 0).toFixed(0)}
              </div>
              <div className="text-sm text-gray-600">Potential Savings</div>
            </div>
          </div>
        </div>
      )}

      {/* List View */}
      {mapView === 'list' && (
        <div className="max-w-7xl mx-auto px-4 pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {dealsWithFavorite.map(deal => (
              <DealCard
                key={deal.id}
                deal={deal}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
