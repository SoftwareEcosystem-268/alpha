'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'

export default function PrivacyPage() {
  const router = useRouter()
  const [hasScrolled, setHasScrolled] = useState(false)
  const [accepted, setAccepted] = useState(false)

  useEffect(() => {
    const checkIfAccepted = () => {
      const element = document.getElementById('privacy-content')
      if (element) {
        const scrollTop = element.scrollTop
        const scrollHeight = element.scrollHeight - element.clientHeight
        if (scrollTop >= scrollHeight - 100) {
          setHasScrolled(true)
        }
      }
    }

    const element = document.getElementById('privacy-content')
    element?.addEventListener('scroll', checkIfAccepted)
    return () => element?.removeEventListener('scroll', checkIfAccepted)
  }, [])

  const handleAccept = () => {
    localStorage.setItem('privacyAccepted', 'true')
    setAccepted(true)
    setTimeout(() => router.push('/deals'), 300)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
      <Navigation />

      <div className="max-w-3xl mx-auto px-4 pt-24 pb-12">
        <div className="card overflow-hidden">
          {/* Header */}
          <div className="p-8 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-white">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy & Terms of Service</h1>
            <p className="text-gray-600">Please read and accept to continue using RichSave</p>
          </div>

          {/* Scrollable Content */}
          <div
            id="privacy-content"
            className="p-8 h-[60vh] overflow-y-auto custom-scrollbar"
          >
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Privacy Policy</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                At RichSave, we take your privacy seriously. This policy explains how we collect, use, and protect your information.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Information We Collect</h3>
              <div className="space-y-3 text-gray-600">
                <p><strong>Personal Information:</strong> When you create an account, we collect your name, email address, and password.</p>
                <p><strong>Location Data:</strong> With your consent, we collect your location to show nearby deals.</p>
                <p><strong>Usage Data:</strong> We track how you use the app to improve our services.</p>
                <p><strong>Savings Data:</strong> We track deals you've saved and money you've saved to provide insights.</p>
                <p><strong>Favorites:</strong> We store deals you've bookmarked for quick access.</p>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">2. How We Use Your Information</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>Provide personalized deal recommendations based on your preferences</li>
                <li>Show deals available near your location</li>
                <li>Track and display your savings progress</li>
                <li>Send notifications about new deals (optional)</li>
                <li>Improve our app functionality and user experience</li>
                <li>Communicate important updates and security alerts</li>
              </ul>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Data Security</h3>
              <p className="text-gray-600 mb-3">We implement industry-standard security measures to protect your data:</p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>Passwords are securely hashed using bcrypt</li>
                <li>All data is encrypted in transit using HTTPS/TLS</li>
                <li>We use JWT tokens for secure authentication</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and authentication requirements</li>
              </ul>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">4. Data Sharing</h3>
              <p className="text-gray-600 mb-3">We do not sell your personal data. We may share data with:</p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>Partner merchants to fulfill deal redemptions</li>
                <li>Service providers who assist in operating our platform</li>
                <li>Legal authorities when required by law</li>
              </ul>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">5. Your Rights</h3>
              <p className="text-gray-600 mb-3">You have the right to:</p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Delete your account and associated data</li>
                <li>Opt-out of marketing communications</li>
                <li>Export your data</li>
              </ul>
            </section>

            <section className="mb-8 border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Terms of Service</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                By using RichSave, you agree to these terms of service.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Account Terms</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>You must be at least 13 years old to use RichSave</li>
                <li>You are responsible for maintaining the security of your account</li>
                <li>You must provide accurate and complete information</li>
                <li>Account sharing is prohibited</li>
                <li>You must notify us of any unauthorized access</li>
              </ul>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Deal Terms</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>All deals are provided by third-party merchants</li>
                <li>We strive for accuracy but cannot guarantee deal availability</li>
                <li>Deals are subject to merchant's terms and conditions</li>
                <li>Some deals may have limited quantities or time restrictions</li>
                <li>We are not responsible for merchant disputes</li>
              </ul>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Prohibited Activities</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>Using the platform for fraudulent purposes</li>
                <li>Abusing or exploiting deals and promotions</li>
                <li>Creating multiple accounts to abuse promotions</li>
                <li>Interfering with the platform's operation</li>
                <li>Attempting to access other users' accounts</li>
              </ul>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">4. Limitation of Liability</h3>
              <p className="text-gray-600">
                RichSave is provided "as is" without warranties. We are not liable for any damages arising from your use of the platform, including but not limited to deal availability, merchant disputes, or service interruptions.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">5. Termination</h3>
              <p className="text-gray-600">
                We reserve the right to suspend or terminate accounts that violate these terms. You may also delete your account at any time from your profile settings.
              </p>
            </section>

            <section className="mb-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">6. Changes to Terms</h3>
              <p className="text-gray-600">
                We may update these terms from time to time. Continued use of the platform after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <p className="text-gray-500 text-sm mt-8 pt-8 border-t border-gray-200">
              Last updated: March 29, 2026<br />
              Contact us at: privacy@richsave.com
            </p>

            {!hasScrolled && (
              <div className="mt-6 p-4 bg-primary-50 border border-primary-200 rounded-xl text-center">
                <p className="text-primary font-medium">👇 Please scroll to the bottom to accept</p>
              </div>
            )}
          </div>

          {/* Accept Button */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={handleAccept}
              disabled={!hasScrolled || accepted}
              className={`w-full py-4 rounded-xl font-semibold transition-all ${
                hasScrolled && !accepted
                  ? 'btn-primary'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {accepted ? '✓ Accepted' : hasScrolled ? 'Accept & Continue' : 'Scroll to Accept'}
            </button>
            <button
              onClick={() => router.back()}
              className="w-full mt-3 py-3 text-gray-600 hover:text-gray-900 font-medium"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
