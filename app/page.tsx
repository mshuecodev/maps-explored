"use client"
import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import type { LatLngTuple } from "leaflet"
import "leaflet/dist/leaflet.css"

// Import marker images
import markerIcon from "leaflet/dist/images/marker-icon.png"
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png"
import markerShadow from "leaflet/dist/images/marker-shadow.png"

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false })
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false })

let L: any // Declare Leaflet as a lazy-loaded variable

const defaultPosition: LatLngTuple = [51.505, -0.09]

export default function Home() {
	const [position, setPosition] = useState<LatLngTuple | null>(null)

	useEffect(() => {
		// Dynamically import Leaflet on the client side
		async function loadLeaflet() {
			const leaflet = await import("leaflet")
			L = leaflet // Assign to the lazy-loaded variable

			// Fix the default marker icon paths
			L.Icon.Default.mergeOptions({
				iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
				iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
				shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
			})
		}
		loadLeaflet()

		// Use the Geolocation API to get the current position
		if (typeof window !== "undefined" && navigator.geolocation) {
			// Options to improve accuracy
			const geolocationOptions = {
				enableHighAccuracy: true, // Use high-accuracy location
				timeout: 10000, // Maximum time to wait for location (10 seconds)
				maximumAge: 0 // Prevent using cached location data
			}

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
					},
					geolocationOptions // Pass the options to improve accuracy
				)
			} else {
				console.error("Geolocation is not supported by this browser.")
				setPosition(defaultPosition) // Fallback to a default position
			}
		}
	}, [])

	return (
		<div style={{ width: "100%", height: "100vh" }}>
			{position && (
				<MapContainer
					center={position}
					zoom={15} // Increase zoom level for better accuracy
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
