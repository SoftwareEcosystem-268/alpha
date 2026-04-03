'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export interface Deal {
  id: string
  title: string
  description: string
  discount: string
  originalPrice: number
  discountedPrice: number
  storeName: string
  storeLogo?: string
  image: string
  category: string
  location?: {
    lat: number
    lng: number
    address: string
  }
  expiresAt?: string
  terms?: string[]
  isFavorite?: boolean
}

interface DealCardProps {
  deal: Deal
  onToggleFavorite?: (dealId: string) => void
}

export default function DealCard({ deal, onToggleFavorite }: DealCardProps) {
  const router = useRouter()
  const [imageError, setImageError] = useState(false)

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleFavorite?.(deal.id)
  }

  const savings = deal.originalPrice - deal.discountedPrice

  return (
    <div
      onClick={() => router.push(`/deals/${deal.id}`)}
      className="card overflow-hidden cursor-pointer group"
    >
      {/* Image Section */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {!imageError ? (
          <img
            src={deal.image}
            alt={deal.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
            <span className="text-6xl">🏷️</span>
          </div>
        )}

        {/* Discount Badge */}
        <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
          {deal.discount} OFF
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-soft hover:shadow-softer transition-all"
        >
          <svg
            className={`w-5 h-5 transition-colors ${deal.isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'}`}
            fill={deal.isFavorite ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>

        {/* Category Badge */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-700">
          {deal.category}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Store Name */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-xs">🏪</span>
          </div>
          <span className="text-sm text-gray-500">{deal.storeName}</span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{deal.title}</h3>

        {/* Price Section */}
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl font-bold text-primary">${deal.discountedPrice.toFixed(2)}</span>
          <span className="text-gray-400 line-through">${deal.originalPrice.toFixed(2)}</span>
          <span className="text-green-600 text-sm font-medium">Save ${savings.toFixed(2)}</span>
        </div>

        {/* Expiry */}
        {deal.expiresAt && (
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Expires {new Date(deal.expiresAt).toLocaleDateString()}</span>
          </div>
        )}

        {/* Location indicator */}
        {deal.location && (
          <div className="flex items-center gap-1 text-sm text-gray-500 mt-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            <span className="truncate">{deal.location.address}</span>
          </div>
        )}
      </div>
    </div>
  )
}
