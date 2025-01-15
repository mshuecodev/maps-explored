"use client"
import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import type { LatLngTuple } from "leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Import marker images
import markerIcon from "leaflet/dist/images/marker-icon.png"
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png"
import markerShadow from "leaflet/dist/images/marker-shadow.png"

// Fix Leaflet's default icon URLs
L.Icon.Default.mergeOptions({
	iconUrl: markerIcon,
	iconRetinaUrl: markerIcon2x,
	shadowUrl: markerShadow
})

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false })
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false })

const defaultPosition: LatLngTuple = [51.505, -0.09]

export default function Home() {
	const [position, setPosition] = useState<LatLngTuple | null>(null)

	useEffect(() => {
		// Use the Geolocation API to get the current position
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(location) => {
					const { latitude, longitude } = location.coords
					setPosition([latitude, longitude]) // Update the state with the current location
				},
				(error) => {
					console.error("Error getting location:", error)
					setPosition(defaultPosition) // Fallback to a default position
				}
			)
		} else {
			console.error("Geolocation is not supported by this browser.")
			setPosition(defaultPosition) // Fallback to a default position
		}
	}, [])

	return (
		<div style={{ width: "100%", height: "100vh" }}>
			{position && (
				<MapContainer
					center={position}
					zoom={13}
					scrollWheelZoom={false}
					style={{ width: "100%", height: "100%" }}
				>
					<TileLayer
						attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
						url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					/>
					<Marker position={position}>
						<Popup>You are here!</Popup>
					</Marker>
				</MapContainer>
			)}
		</div>
	)
}
