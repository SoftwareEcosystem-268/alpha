'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Deal } from './DealCard'

interface MapViewProps {
  userLocation: { lat: number; lng: number }
  deals: Deal[]
  onDealClick: (deal: Deal) => void
  flyTo?: { lat: number; lng: number; zoom?: number }
}

export default function MapView({ userLocation, deals, onDealClick, flyTo }: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const markersRef = useRef<L.Marker[]>([])

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    const map = L.map(mapContainerRef.current, { zoomControl: false }).setView(
      [userLocation.lat, userLocation.lng], 15
    )

    L.control.zoom({ position: 'bottomright' }).addTo(map)

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 19,
    }).addTo(map)

    mapRef.current = map

    const userIcon = L.divIcon({
      className: '',
      html: `<div style="position:relative;width:20px;height:20px;"><div style="position:absolute;inset:0;background:#2563EB;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);z-index:2;"></div><div class="map-pulse" style="position:absolute;inset:-6px;background:rgba(37,99,235,0.2);border-radius:50%;"></div></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    })
    L.marker([userLocation.lat, userLocation.lng], { icon: userIcon }).addTo(map)

    if (!document.getElementById('map-pulse-style')) {
      const style = document.createElement('style')
      style.id = 'map-pulse-style'
      style.textContent = `@keyframes mapPulse{0%,100%{transform:scale(1);opacity:0.5}50%{transform:scale(1.5);opacity:0}}.map-pulse{animation:mapPulse 2s infinite;}`
      document.head.appendChild(style)
    }

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [userLocation])

  useEffect(() => {
    if (!mapRef.current || !flyTo) return
    mapRef.current.flyTo([flyTo.lat, flyTo.lng], flyTo.zoom ?? 15, { duration: 1.2 })
  }, [flyTo])

  useEffect(() => {
    if (!mapRef.current) return
    markersRef.current.forEach(m => m.remove())
    markersRef.current = []

    const markers: L.Marker[] = []
    deals.forEach(deal => {
      if (!deal.location) return
      const icon = L.divIcon({
        className: '',
        html: `<div style="background:#F97316;width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 10px rgba(0,0,0,0.25);border:3px solid white;font-size:14px;cursor:pointer;color:white;font-weight:bold;">${deal.discount}</div>`,
        iconSize: [44, 44],
        iconAnchor: [22, 22],
      })
      const marker = L.marker([deal.location.lat, deal.location.lng], { icon })
      marker.on('click', () => onDealClick(deal))
      marker.addTo(mapRef.current!)
      markers.push(marker)
    })
    markersRef.current = markers
  }, [deals, onDealClick])

  return <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
}
