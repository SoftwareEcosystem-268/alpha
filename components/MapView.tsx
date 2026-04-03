'use client'

import { useEffect, useState, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Deal } from './DealCard'

// Fix for default markers in Leaflet with Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

interface MapViewProps {
  userLocation: { lat: number; lng: number }
  deals: Deal[]
  onDealClick: (deal: Deal) => void
  onToggleFavorite: (dealId: string) => void
}

export default function MapView({ userLocation, deals, onDealClick, onToggleFavorite }: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const markersRef = useRef<L.Marker[]>([])

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    // Initialize map
    const map = L.map(mapContainerRef.current).setView([userLocation.lat, userLocation.lng], 13)

    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map)

    mapRef.current = map

    // Custom icons
    const createCustomIcon = (discount: string) => {
      return L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            background: #22C55E;
            color: white;
            padding: 4px 8px;
            border-radius: 12px;
            font-weight: bold;
            font-size: 12px;
            white-space: nowrap;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          ">
            ${discount}
          </div>
        `,
        iconSize: [60, 30],
        iconAnchor: [30, 30],
      })
    }

    // User location marker
    const userIcon = L.divIcon({
      className: 'user-marker',
      html: `
        <div style="
          background: #3B82F6;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        "></div>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    })

    L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
      .addTo(map)
      .bindPopup('You are here')

    // Add deal markers
    const markers: L.Marker[] = []

    deals.forEach(deal => {
      if (deal.location) {
        const marker = L.marker([deal.location.lat, deal.location.lng], {
          icon: createCustomIcon(deal.discount),
        })

        const popupContent = `
          <div style="min-width: 200px;">
            <img src="${deal.image}" style="width: 100%; height: 100px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />
            <h3 style="font-weight: bold; margin: 0 0 4px 0;">${deal.title}</h3>
            <p style="color: #666; font-size: 12px; margin: 0 0 8px 0;">${deal.storeName}</p>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-weight: bold; color: #22C55E;">$${deal.discountedPrice.toFixed(2)}</span>
              <span style="text-decoration: line-through; color: #999;">$${deal.originalPrice.toFixed(2)}</span>
            </div>
          </div>
        `

        marker.addTo(map).bindPopup(popupContent)
        marker.on('click', () => onDealClick(deal))
        markers.push(marker)
      }
    })

    markersRef.current = markers

    // Fit bounds to show all markers
    if (deals.length > 0 && deals[0].location) {
      const group = new L.FeatureGroup([
        L.marker([userLocation.lat, userLocation.lng]),
        ...markers,
      ])
      map.fitBounds(group.getBounds().pad(0.1))
    }

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [userLocation])

  // Update markers when deals change
  useEffect(() => {
    if (!mapRef.current) return

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove())
    markersRef.current = []

    // Add new markers
    const markers: L.Marker[] = []

    deals.forEach(deal => {
      if (deal.location) {
        const marker = L.marker([deal.location.lat, deal.location.lng], {
          icon: L.divIcon({
            className: 'custom-marker',
            html: `
              <div style="
                background: #22C55E;
                color: white;
                padding: 4px 8px;
                border-radius: 12px;
                font-weight: bold;
                font-size: 12px;
                white-space: nowrap;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
              ">
                ${deal.discount}
              </div>
            `,
            iconSize: [60, 30],
            iconAnchor: [30, 30],
          }),
        })

        const popupContent = `
          <div style="min-width: 200px;">
            <img src="${deal.image}" style="width: 100%; height: 100px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />
            <h3 style="font-weight: bold; margin: 0 0 4px 0;">${deal.title}</h3>
            <p style="color: #666; font-size: 12px; margin: 0 0 8px 0;">${deal.storeName}</p>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-weight: bold; color: #22C55E;">$${deal.discountedPrice.toFixed(2)}</span>
              <span style="text-decoration: line-through; color: #999;">$${deal.originalPrice.toFixed(2)}</span>
            </div>
          </div>
        `

        marker.addTo(mapRef.current).bindPopup(popupContent)
        marker.on('click', () => onDealClick(deal))
        markers.push(marker)
      }
    })

    markersRef.current = markers
  }, [deals, onDealClick])

  return (
    <div
      ref={mapContainerRef}
      className="h-96 md:h-[500px] w-full bg-gray-200"
    />
  )
}
