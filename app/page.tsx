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
	const [currentLocation, setCurrentLocation] = useState<LatLngTuple | null>(null)
	const [destination, setDestination] = useState<LatLngTuple | null>(null)

	const [address, setAddress] = useState<string>("Loading address...")

	const [currentInput, setCurrentInput] = useState<string>("")
	const [destinationInput, setDestinationInput] = useState<string>("")

	const [currentSuggestions, setCurrentSuggestions] = useState<any[]>([])
	const [destinationSuggestions, setDestinationSuggestions] = useState<any[]>([])

	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [zoomLevel, setZoomLevel] = useState<number>(15)

	const mapRef = useRef<any>(null) // Reference to the map
	const debounceTimer = useRef<NodeJS.Timeout>(null) // Ref to store the debounce timer
	const routingControlRef = useRef<any>(null)

	// Handle the search query input
	const handleSearch = async () => {
		if (currentInput) {
			const response = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(currentInput)}`)
			const data = await response.json()
			if (data.length > 0) {
				const { lat, lon, display_name } = data[0]
				const newPosition: [number, number] = [parseFloat(lat), parseFloat(lon)]
				setCurrentLocation(newPosition)
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

	const fetchSuggestions = async (query: string, isCurrent: boolean) => {
		if (!query) {
			if (isCurrent) setCurrentSuggestions([])
			else setDestinationSuggestions([])
			return
		}

		setIsLoading(true) // Start loading
		try {
			const encodedQuery = query.replace(/ /g, "+") // Replace spaces with '+'

			const response = await fetch(`https://nominatim.openstreetmap.org/search.php?q=${encodedQuery}&format=jsonv2`)
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}

			const data = await response.json()
			if (isCurrent) {
				setCurrentSuggestions(data)
			} else {
				setDestinationSuggestions(data)
			}
		} catch (error) {
			console.error("Error fetching suggestions:", error)
			if (isCurrent) {
				setCurrentSuggestions([])
			} else {
				setDestinationSuggestions([])
			}
		} finally {
			setIsLoading(false) // Stop loading
		}
	}

	// select location
	const handleLocationSelect = (item: any, isCurrent: boolean) => {
		const newPosition: LatLngTuple = [parseFloat(item.lat), parseFloat(item.lon)]

		if (isCurrent) {
			setCurrentLocation(newPosition)
			setCurrentInput(item.display_name)
			setCurrentSuggestions([])
		} else {
			setDestination(newPosition)
			setDestinationInput(item.display_name)
			setDestinationSuggestions([])
		}

		// Recenter map to current location if the current location is selected
		// if (isCurrent && mapRef.current) {
		// 	mapRef.current.setView(newPosition, zoomLevel, { animate: true })
		// }

		// Fit bounds to show both markers
		if (mapRef.current) {
			const bounds = L.latLngBounds([])
			if (currentLocation) bounds.extend(currentLocation)
			if (isCurrent) bounds.extend(newPosition) // Add current marker to bounds
			if (!isCurrent && destination) bounds.extend(destination) // Add destination marker to bounds
			mapRef.current.fitBounds(bounds, { padding: [50, 50] }) // Adjust padding as needed
		}
	}

	// Handle input change with debounce
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, isCurrent: boolean) => {
		const value = e.target.value
		// Clear previous timeout to reset debounce delay
		if (debounceTimer.current) {
			clearTimeout(debounceTimer.current)
		}

		// Set a new timeout to call fetchSuggestions after 500ms delay
		debounceTimer.current = setTimeout(() => {
			fetchSuggestions(value, isCurrent)
		}, 500) // 500ms delay before making the API request

		if (isCurrent) setCurrentInput(value)
		else setDestinationInput(value)
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

	// Function to recenter the map
	const recenterMap = () => {
		if (mapRef.current && currentLocation) {
			mapRef.current.setView(currentLocation, zoomLevel, { animate: true })
		}
	}

	const startNavigation = () => {
		if (mapRef.current && currentLocation && destination) {
			// Remove existing route if any
			if (routingControlRef.current) {
				mapRef.current.removeControl(routingControlRef.current) // Remove any existing route
			}

			routingControlRef.current = L.Routing.control({
				waypoints: [L.latLng(currentLocation[0], currentLocation[1]), L.latLng(destination[0], destination[1])],
				routeWhileDragging: true,
				show: true,
				lineOptions: { styles: [{ color: "blue", weight: 4 }] }
			}).addTo(mapRef.current) // Add the routing control to the map
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
						setCurrentLocation([latitude, longitude]) // Update the state with the current location
						fetchAddress(latitude, longitude) // Fetch the address
					},
					(error) => {
						console.error("Error getting location:", error)
						setCurrentLocation(defaultPosition) // Fallback to a default position
						fetchAddress(defaultPosition[0], defaultPosition[1]) // Fetch address for the default position
					},
					geolocationOptions // Pass the options to improve accuracy
				)
			} else {
				console.error("Geolocation is not supported by this browser.")
				setCurrentLocation(defaultPosition) // Fallback to a default position
				fetchAddress(defaultPosition[0], defaultPosition[1])
			}
		}
	}, [])

	useEffect(() => {
		if (mapRef.current) {
			const mapInstance = mapRef.current

			// Set zoom level and attach event listeners
			setZoomLevel(mapInstance.getZoom())

			mapInstance.on("zoomend", () => {
				setZoomLevel(mapInstance.getZoom())
			})

			// Center and fit bounds if currentLocation and destination are available
			if (currentLocation && destination) {
				const bounds = L.latLngBounds([currentLocation, destination])
				mapInstance.fitBounds(bounds, { padding: [50, 50] })
			} else if (currentLocation) {
				mapInstance.setView(currentLocation, zoomLevel, { animate: true })
			}
		}
	}, [currentLocation, destination]) // Run effect whenever markers change

	return (
		<div className="relative w-full h-screen">
			{/* Search bar for destination */}
			<div className="absolute top-4 left-20 z-[1000] bg-white shadow-lg rounded-lg p-2 flex flex-col">
				<div className="flex items-center space-x-2">
					<input
						type="text"
						value={currentInput}
						onChange={(e) => handleInputChange(e, true)} //value, current location
						placeholder="Search current location"
						className="p-2 border border-gray-300 rounded-lg text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<div className="flex items-center space-x-2">
					{/* Destination Input */}
					<input
						type="text"
						placeholder="Search destination"
						value={destinationInput}
						onChange={(e) => handleInputChange(e, false)}
						className="p-2 border border-gray-300 rounded-lg text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-500"
					/>

					<button
						onClick={startNavigation}
						className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
						disabled={!destination}
					>
						Start Navigation
					</button>
				</div>

				{currentSuggestions.length > 0 && !isLoading && (
					<ul className="mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
						{currentSuggestions.map((item, index) => (
							<li
								key={index}
								onClick={() => handleLocationSelect(item, true)}
								className="p-2 text-gray-900 hover:bg-gray-200 cursor-pointer"
							>
								{item.display_name}
							</li>
						))}
					</ul>
				)}

				{destinationSuggestions.length > 0 && !isLoading && (
					<ul className="mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
						{destinationSuggestions.map((item, index) => (
							<li
								key={index}
								onClick={() => handleLocationSelect(item, false)}
								className="p-2 text-gray-900 hover:bg-gray-200 cursor-pointer"
							>
								{item.display_name}
							</li>
						))}
					</ul>
				)}

				{/* Add a recenter button */}
				<button
					onClick={recenterMap}
					className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
				>
					Recenter Map
				</button>

				{/* Loading Spinner */}
				{isLoading && (
					<div className="mt-2 flex items-center justify-center text-gray-500">
						<div className="animate-spin rounded-full h-5 w-5 border-t-2 border-blue-500 border-opacity-75"></div>
						<span className="ml-2 text-sm">Loading...</span>
					</div>
				)}

				{/* Show message when no suggestions found */}
				{currentSuggestions.length === 0 && currentInput && !isLoading && (
					<ul className="mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
						<li className="p-2 text-gray-500 text-center">No location found</li>
					</ul>
				)}
			</div>

			{currentLocation && (
				<MapContainer
					// key={currentLocation?.join(",")} // Use the currentLocation to generate a unique key
					center={currentLocation}
					zoom={zoomLevel} // Increase zoom level for better accuracy
					scrollWheelZoom={true}
					className="w-full h-full"
					ref={mapRef}
					// whenReady={(event: any) => {
					// 	setZoomLevel(event.target.getZoom())
					// 	event.target.on("zoomend", () => {
					// 		setZoomLevel(event.target.getZoom())
					// 	})

					// 	// Center and fit bounds if currentLocation and destination are available
					// 	if (currentLocation && destination) {
					// 		const bounds = L.latLngBounds([currentLocation, destination])
					// 		event.target.fitBounds(bounds, { padding: [50, 50] })
					// 	} else if (currentLocation) {
					// 		// Center to currentLocation if only one marker is set
					// 		event.target.setView(currentLocation, zoomLevel, { animate: true })
					// 	}
					// }}
				>
					<TileLayer
						attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
						url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					/>
					{/* Current Location Marker */}
					<Marker
						position={currentLocation}
						draggable={true}
						eventHandlers={{
							dragend: (event) => {
								const marker = event.target
								const newPos = marker.getLatLng()

								setCurrentLocation([newPos.lat, newPos.lng])
								fetchAddress(newPos.lat, newPos.lng)
							}
						}}
					>
						<Popup>{address}</Popup>
					</Marker>

					{/* Current Destination Marker */}

					{destination && (
						<Marker
							position={destination}
							draggable={true}
							eventHandlers={{
								dragend: (event) => {
									const marker = event.target
									const newPos = marker.getLatLng()

									setDestination([newPos.lat, newPos.lng])
									fetchAddress(newPos.lat, newPos.lng)
								}
							}}
						>
							<Popup>{address}</Popup>
						</Marker>
					)}
				</MapContainer>
			)}
		</div>
	)
}
