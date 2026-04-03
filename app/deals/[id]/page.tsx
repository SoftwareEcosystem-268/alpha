'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Navigation from '@/components/Navigation'
import QRCode from 'qrcode'
import { Deal } from '@/components/DealCard'

// Mock deal data - will be replaced with MongoDB data
const mockDeal: Deal = {
  id: '1',
  title: '50% Off All Pizzas',
  description: 'Get half price on all large and medium pizzas. Valid for dine-in and delivery. This amazing offer is perfect for family dinners, parties, or just treating yourself to delicious pizza!',
  discount: '50%',
  originalPrice: 30,
  discountedPrice: 15,
  storeName: "Domino's Pizza",
  image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200',
  category: 'Food',
  location: { lat: 40.7128, lng: -74.006, address: '123 Main St, New York, NY 10001' },
  expiresAt: '2026-04-30',
  terms: [
    'Valid for dine-in and delivery only',
    'Not valid with other offers or promotions',
    'One coupon per order per visit',
    'Must present this coupon before ordering',
    'Valid at participating locations only',
    'Cannot be combined with loyalty rewards',
    'No cash value',
  ],
}

export default function DealDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [deal, setDeal] = useState<Deal | null>(null)
  const [qrCode, setQrCode] = useState('')
  const [showQrModal, setShowQrModal] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    // Check authentication
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }

    // Check if favorite
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    setIsFavorite(favorites.includes(mockDeal.id))

    // In real app, fetch deal from API
    // const response = await fetch(`/api/deals/${params.id}`)
    // const data = await response.json()
    setDeal(mockDeal)

    // Generate QR code
    generateQRCode()
  }, [params.id])

  useEffect(() => {
    if (deal?.expiresAt) {
      const updateCountdown = () => {
        const now = new Date().getTime()
        const expiry = new Date(deal.expiresAt).getTime()
        const distance = expiry - now

        if (distance > 0) {
          setCountdown({
            days: Math.floor(distance / (1000 * 60 * 60 * 24)),
            hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((distance % (1000 * 60)) / 1000),
          })
        }
      }

      updateCountdown()
      const interval = setInterval(updateCountdown, 1000)
      return () => clearInterval(interval)
    }
  }, [deal])

  const generateQRCode = async () => {
    try {
      const qrData = `RICHSAVE:${mockDeal.id}:${Date.now()}`
      const url = await QRCode.toDataURL(qrData, {
        width: 300,
        margin: 2,
        color: {
          dark: '#166534',
          light: '#F0FDF4',
        },
      })
      setQrCode(url)
    } catch (err) {
      console.error('Failed to generate QR code:', err)
    }
  }

  const handleToggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    const newFavorites = isFavorite
      ? favorites.filter((id: string) => id !== deal?.id)
      : [...favorites, deal?.id]

    localStorage.setItem('favorites', JSON.stringify(newFavorites))
    setIsFavorite(!isFavorite)
  }

  const handleRedeem = () => {
    if (!user) {
      router.push('/login')
      return
    }
    setShowQrModal(true)
  }

  if (!deal) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading deal...</p>
        </div>
      </div>
    )
  }

  const savings = deal.originalPrice - deal.discountedPrice

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation isAuthenticated={!!user} userName={user?.name} />

      {/* Hero Image */}
      <div className="relative h-72 md:h-96 bg-gray-200">
        <img
          src={deal.image}
          alt={deal.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/1200x400?text=Deal+Image'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black-60 to-transparent"></div>

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="absolute top-20 left-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-soft hover:shadow-softer transition-all"
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>

        {/* Favorite Button */}
        <button
          onClick={handleToggleFavorite}
          className="absolute top-20 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-soft hover:shadow-softer transition-all"
        >
          <svg
            className={`w-5 h-5 transition-colors ${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'}`}
            fill={isFavorite ? 'currentColor' : 'none'}
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

        {/* Discount Badge */}
        <div className="absolute bottom-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-lg">
          {deal.discount} OFF
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Title Section */}
        <div className="card p-6 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-primary-100 text-primary rounded-full text-sm font-medium">
              {deal.category}
            </span>
            {deal.expiresAt && (
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Expires {new Date(deal.expiresAt).toLocaleDateString()}
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-3">{deal.title}</h1>

          {/* Store Info */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🏪</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900">{deal.storeName}</p>
              {deal.location && (
                <p className="text-sm text-gray-500">{deal.location.address}</p>
              )}
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center gap-4 py-4 border-t border-b border-gray-200">
            <div>
              <span className="text-4xl font-bold text-primary">${deal.discountedPrice.toFixed(2)}</span>
              <span className="text-xl text-gray-400 line-through ml-3">${deal.originalPrice.toFixed(2)}</span>
            </div>
            <div className="ml-auto px-4 py-2 bg-green-100 text-green-700 rounded-xl font-semibold">
              You save ${savings.toFixed(2)}
            </div>
          </div>

          {/* Countdown Timer */}
          {countdown.days > 0 || countdown.hours > 0 || countdown.minutes > 0 ? (
            <div className="mt-4 flex items-center gap-4">
              <span className="text-sm text-gray-600">Deal expires in:</span>
              <div className="flex gap-2">
                {countdown.days > 0 && (
                  <div className="bg-gray-100 px-3 py-2 rounded-lg text-center">
                    <div className="text-xl font-bold text-gray-900">{countdown.days}</div>
                    <div className="text-xs text-gray-500">Days</div>
                  </div>
                )}
                <div className="bg-gray-100 px-3 py-2 rounded-lg text-center">
                  <div className="text-xl font-bold text-gray-900">{countdown.hours}</div>
                  <div className="text-xs text-gray-500">Hours</div>
                </div>
                <div className="bg-gray-100 px-3 py-2 rounded-lg text-center">
                  <div className="text-xl font-bold text-gray-900">{countdown.minutes}</div>
                  <div className="text-xs text-gray-500">Mins</div>
                </div>
                <div className="bg-gray-100 px-3 py-2 rounded-lg text-center">
                  <div className="text-xl font-bold text-gray-900">{countdown.seconds}</div>
                  <div className="text-xs text-gray-500">Secs</div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Description */}
        <div className="card p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">About This Deal</h2>
          <p className="text-gray-600 leading-relaxed">{deal.description}</p>
        </div>

        {/* Terms & Conditions */}
        {deal.terms && deal.terms.length > 0 && (
          <div className="card p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Terms & Conditions</h2>
            <ul className="space-y-2">
              {deal.terms.map((term, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-600">
                  <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {term}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Location Map */}
        {deal.location && (
          <div className="card p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Location</h2>
            <div className="bg-gray-200 rounded-xl h-48 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p>{deal.location.address}</p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(deal.location.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-primary hover:text-primary-600 font-medium"
                >
                  Open in Maps
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Redeem Button */}
        <button
          onClick={handleRedeem}
          className="btn-primary w-full py-4 text-lg"
        >
          Redeem This Deal
        </button>

        {/* Share */}
        <button className="w-full mt-3 py-3 text-gray-600 hover:text-gray-900 font-medium flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share this deal
        </button>
      </div>

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 bg-black-50 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-8 shadow-softer">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Ready to Redeem!</h3>
              <p className="text-gray-600 mt-2">Show this QR code at the counter</p>
            </div>

            {qrCode && (
              <div className="bg-white p-4 rounded-2xl border-2 border-dashed border-primary-300 mb-6">
                <img src={qrCode} alt="Redemption QR Code" className="w-full" />
              </div>
            )}

            <div className="bg-primary-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-primary-800 text-center font-medium">
                {deal.title}
              </p>
              <p className="text-xs text-primary-600 text-center mt-1">
                {deal.storeName}
              </p>
            </div>

            <button
              onClick={() => setShowQrModal(false)}
              className="btn-secondary w-full"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
