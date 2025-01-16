"use client"
import { useState, useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import type { LatLngTuple } from "leaflet"
import "leaflet/dist/leaflet.css"

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false })
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false })

let L: any // Declare Leaflet as a lazy-loaded variable

const defaultPosition: LatLngTuple = [51.505, -0.09]

export default function Home() {
	const [position, setPosition] = useState<LatLngTuple | null>(null)
	const [address, setAddress] = useState<string>("Loading address...")
	const [searchQuery, setSearchQuery] = useState<string>("")
	const [suggestions, setSuggestions] = useState<any[]>([])
	const mapRef = useRef<any>(null) // Reference to the map

	// Handle the search query input
	const handleSearch = async () => {
		if (searchQuery) {
			const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(searchQuery)}`)
			const data = await response.json()
			if (data.length > 0) {
				const { lat, lon, display_name } = data[0]
				const newPosition: [number, number] = [parseFloat(lat), parseFloat(lon)]
				setPosition(newPosition)
				setAddress(display_name)

				// Animate the map to the new position
				if (mapRef.current) {
					mapRef.current.setView(newPosition, 15, { animate: true })
				}
			} else {
				alert("Location not found.")
			}
		}
	}

	const fetchSuggestions = async (query: string) => {
		if (query.length > 2) {
			// Fetch suggestions for 3+ characters
			const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`)
			const data = await response.json()
			setSuggestions(data)
		} else {
			setSuggestions([])
		}
	}

	async function fetchAddress(lat: number, lon: number) {
		try {
			const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`)
			const data = await response.json()
			if (data && data.display_name) {
				setAddress(data.display_name) // Update the address
			} else {
				setAddress("Address not found.")
			}
		} catch (error) {
			console.error("Error fetching address:", error)
			setAddress("Failed to load address.")
		}
	}

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
						fetchAddress(latitude, longitude) // Fetch the address
					},
					(error) => {
						console.error("Error getting location:", error)
						setPosition(defaultPosition) // Fallback to a default position
						fetchAddress(defaultPosition[0], defaultPosition[1]) // Fetch address for the default position
					},
					geolocationOptions // Pass the options to improve accuracy
				)
			} else {
				console.error("Geolocation is not supported by this browser.")
				setPosition(defaultPosition) // Fallback to a default position
				fetchAddress(defaultPosition[0], defaultPosition[1])
			}
		}
	}, [])

	return (
		<div className="relative w-full h-screen">
			{/* Search bar for destination */}
			<div
				// className="absolute top-4 left-20 z-[1000] bg-white shadow-lg rounded-lg p-2 flex items-center"
				className="absolute top-4 left-20 z-[1000] bg-white shadow-lg rounded-lg p-2 flex flex-col"
			>
				<div className="flex items-center space-x-2">
					<input
						type="text"
						value={searchQuery}
						onChange={(e) => {
							setSearchQuery(e.target.value)
							fetchSuggestions(e.target.value)
						}}
						placeholder="Search for a location"
						// className="p-2 border border-gray-300 rounded-lg flex-grow text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-500"
						className="p-2 border border-gray-300 rounded-lg text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-500"
					/>
					<button
						onClick={handleSearch}
						// className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
						className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
					>
						Search
					</button>
				</div>

				{/* Suggestions */}
				{suggestions.length > 0 && (
					<ul
						// className="mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto"
						className="mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto"
					>
						{suggestions.map((item, index) => (
							<li
								key={index}
								onClick={() => {
									setSearchQuery(item.display_name)
									setPosition([parseFloat(item.lat), parseFloat(item.lon)])
									setSuggestions([]) // Clear suggestions
									if (mapRef.current) {
										mapRef.current.setView([parseFloat(item.lat), parseFloat(item.lon)], 15, { animate: true })
									}
								}}
								className="p-2 text-gray-900 hover:bg-gray-200 cursor-pointer"
							>
								{item.display_name}
							</li>
						))}
					</ul>
				)}
			</div>

			{position && (
				<MapContainer
					key={position?.join(",")} // Use the position to generate a unique key
					center={position}
					zoom={15} // Increase zoom level for better accuracy
					scrollWheelZoom={false}
					className="w-full h-full"
					ref={mapRef}
				>
					<TileLayer
						attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
						url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					/>
					<Marker position={position}>
						<Popup>{address}</Popup>
					</Marker>
				</MapContainer>
			)}
		</div>
	)
}
