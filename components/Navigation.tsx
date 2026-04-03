'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface NavigationProps {
  isAuthenticated?: boolean
  userName?: string
}

export default function Navigation({ isAuthenticated = false, userName = '' }: NavigationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Deals', href: '/deals', icon: '🏷️' },
    { name: 'Nearby', href: '/nearby', icon: '📍' },
    { name: 'Favorites', href: '/favorites', icon: '❤️' },
    { name: 'Savings', href: '/savings', icon: '📊' },
  ]

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  // Don't show navigation on login/signup/forgot-password pages
  const hideNavPaths = ['/login', '/signup', '/forgot-password', '/reset-password']
  if (hideNavPaths.includes(pathname)) {
    return null
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-soft' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">$</span>
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">RichSave</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
                  pathname === item.href
                    ? 'bg-primary-100 text-primary'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </button>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => router.push('/profile')}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold">{userName?.charAt(0)?.toUpperCase()}</span>
                  </div>
                  <span className="text-gray-700 font-medium">{userName}</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-gray-700 hover:text-red-500 font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push('/login')}
                  className="px-4 py-2 text-gray-700 font-medium hover:text-primary transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => router.push('/signup')}
                  className="btn-primary"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => {
                    router.push(item.href)
                    setIsMenuOpen(false)
                  }}
                  className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-3 ${
                    pathname === item.href
                      ? 'bg-primary-100 text-primary'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </button>
              ))}

              <div className="border-t border-gray-200 mt-2 pt-2">
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => {
                        router.push('/profile')
                        setIsMenuOpen(false)
                      }}
                      className="w-full px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-3 text-left"
                    >
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary font-semibold">{userName?.charAt(0)?.toUpperCase()}</span>
                      </div>
                      <span className="text-gray-700 font-medium">{userName}</span>
                    </button>
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsMenuOpen(false)
                      }}
                      className="w-full px-4 py-3 rounded-xl hover:bg-red-50 text-red-500 font-medium transition-colors text-left"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        router.push('/login')
                        setIsMenuOpen(false)
                      }}
                      className="w-full px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors text-left text-gray-700 font-medium"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        router.push('/signup')
                        setIsMenuOpen(false)
                      }}
                      className="w-full btn-primary text-left"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
