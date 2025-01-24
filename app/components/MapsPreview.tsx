import React, { useState, useRef, useEffect } from "react"
import dynamic from "next/dynamic"
import { LatLngTuple } from "leaflet"
import proj4 from "proj4"

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false })
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false })
const Polyline = dynamic(() => import("react-leaflet").then((mod) => mod.Polyline), { ssr: false })
import { decodePolyline } from "@/app/utils/decodePolyline"

let L: any // Declare Leaflet as a lazy-loaded variable

const defaultPosition: LatLngTuple = [51.505, -0.09]

// Define the UTM projection (example for UTM zone 33N)
const utmProjection = "+proj=utm +zone=33 +datum=WGS84 +units=m +no_defs"

const MapsPreview: React.FC = () => {
	const [currentLocation, setCurrentLocation] = useState<LatLngTuple | null>(null)
	const [destination, setDestination] = useState<LatLngTuple | null>(null)
	const [route, setRoute] = useState<any>(null)

	const [address, setAddress] = useState<string>("Loading address...")

	const [currentInput, setCurrentInput] = useState<string>("")
	const [destinationInput, setDestinationInput] = useState<string>("")

	const [currentSuggestions, setCurrentSuggestions] = useState<any[]>([])
	const [destinationSuggestions, setDestinationSuggestions] = useState<any[]>([])

	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [zoomLevel, setZoomLevel] = useState<number>(15)
	const [error, setError] = useState<string | null>(null)

	const mapRef = useRef<any>(null) // Reference to the map

	const debounceTimer = useRef<NodeJS.Timeout>(null) // Ref to store the debounce timer
	const routingControlRef = useRef<any>(null)

	const convertCoordinates = (x: number, y: number): LatLngTuple => {
		// Convert UTM coordinates to latitude and longitude
		const [longitude, latitude] = proj4(utmProjection, "WGS84", [x, y])
		return [latitude, longitude]
	}

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

		// const [latitude, longitude] = convertCoordinates(item.x, item.y)
		// const newPosition: LatLngTuple = [latitude, longitude]

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

		if (isCurrent) {
			setCurrentInput(value)
			setDestinationInput("")
		} else setDestinationInput(value)
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

	const updateAddress = async (lat: number, lon: number, isCurrent: boolean) => {
		const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`)
		const data = await response.json()
		if (data && data.display_name) {
			if (isCurrent) {
				setCurrentInput(data.display_name)
			} else {
				setDestinationInput(data.display_name)
			}
		}
	}

	// Function to recenter the map
	const recenterMap = () => {
		if (mapRef.current && currentLocation) {
			mapRef.current.setView(currentLocation, zoomLevel, { animate: true })
		}
	}

	const startNavigation = () => {
		if (!L || !L.Routing || !L.Routing.control) {
			console.error("Leaflet Routing Machine is not loaded.")
			return
		}

		if (!mapRef.current || !currentLocation || !destination) {
			console.error("Map reference or locations are not set")
			return
		}

		// Check if routingControlRef.current exists
		if (routingControlRef.current) {
			mapRef.current.removeControl(routingControlRef.current) // Remove existing route if any
			routingControlRef.current = null
		}

		try {
			routingControlRef.current = L.Routing.control({
				waypoints: [L.latLng(currentLocation[0], currentLocation[1]), L.latLng(destination[0], destination[1])],
				routeWhileDragging: true,
				show: true,
				lineOptions: { styles: [{ color: "blue", weight: 4 }] }
			}).addTo(mapRef.current) // Add the routing control to the map
		} catch (error) {
			console.error("Error setting up routing:", error)
		}
	}

	async function fetchRoute() {
		if (currentLocation && destination) {
			try {
				const url = `https://router.project-osrm.org/route/v1/driving/${currentLocation[1]},${currentLocation[0]};${destination[1]},${destination[0]}?overview=full&geometries=polyline`
				const response = await fetch(url)
				const data = await response.json()

				if (data.routes && data.routes.length > 0) {
					// Decode the polyline geometry
					const routeCoordinates = decodePolyline(data.routes[0].geometry)
					setRoute(routeCoordinates)
				} else {
					console.error("No routes found")
				}
			} catch (error) {
				console.error("Error fetching route:", error)
			}
		}
	}

	const requestLocationPermission = () => {
		// Use the Geolocation API to get the current position
		if (typeof window !== "undefined" && navigator.geolocation) {
			// Options to improve accuracy
			const geolocationOptions = {
				enableHighAccuracy: true, // Use high-accuracy location
				timeout: 10000, // Maximum time to wait for location (10 seconds)
				maximumAge: 0 // Prevent using cached location data
			}

			// Use the Geolocation API to get the current position
			navigator.geolocation.getCurrentPosition(
				(location) => {
					const { latitude, longitude, accuracy } = location.coords
					// const newLocation: LatLngTuple = convertCoordinates(latitude, longitude)
					const newLocation: LatLngTuple = [latitude, longitude]
					setCurrentLocation(newLocation) // Update the state with the current location
					fetchAddress(latitude, longitude) // Fetch the address
					setError(null)
					if (mapRef.current) {
						mapRef.current.setView(newLocation, zoomLevel) // Zoom and focus on the current location
					}
					console.log(`Location accuracy: ${accuracy} meters`)
				},
				(error) => {
					console.error("Error getting location:", error)
					setCurrentLocation(defaultPosition) // Fallback to a default position
					fetchAddress(defaultPosition[0], defaultPosition[1]) // Fetch address for the default position
					setError("Error getting location: user denied geolocation")
				},
				geolocationOptions // Pass the options to improve accuracy
			)
		} else {
			console.error("Geolocation is not supported by this browser.")
			setCurrentLocation(defaultPosition) // Fallback to a default position
			fetchAddress(defaultPosition[0], defaultPosition[1])
			setError("Geolocation is not supported by this browser.") // Set error message
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

		// Request permissions and get the current position
		requestLocationPermission()
	}, [])

	useEffect(() => {
		if (mapRef.current && currentLocation && destination) {
			const bounds = L.latLngBounds([currentLocation, destination])
			mapRef.current.fitBounds(bounds, { padding: [50, 50] }) // Adjust padding as needed
		}

		fetchRoute()
	}, [currentLocation, destination]) // Run effect whenever markers change

	return (
		<div className="relative w-full h-screen">
			{error && (
				<div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-white shadow-lg rounded-lg p-4">
					<p className="text-red-500">{error}</p>
					<p className="text-gray-600">Please enable location services in your browser settings and try again.</p>
					<button
						onClick={requestLocationPermission}
						className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
					>
						Retry Location Access
					</button>
				</div>
			)}
			{/* Search bar for destination */}
			<div className="absolute top-4 left-20 z-[1000] bg-white shadow-lg rounded-lg p-2 flex flex-col space-y-2">
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
					<input
						type="text"
						placeholder="Search destination"
						value={destinationInput}
						onChange={(e) => handleInputChange(e, false)}
						className="p-2 border border-gray-300 rounded-lg text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-500"
					/>
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
				{isLoading ? (
					<div className="mt-2 flex items-center justify-center text-gray-500">
						<div className="animate-spin rounded-full h-5 w-5 border-t-2 border-blue-500 border-opacity-75"></div>
						<span className="ml-2 text-sm">Loading...</span>
					</div>
				) : null}
			</div>

			{currentLocation && (
				<MapContainer
					center={currentLocation || defaultPosition}
					zoom={zoomLevel} // Increase zoom level for better accuracy
					scrollWheelZoom={true}
					className="w-full h-full"
					ref={mapRef}
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
								// fetchAddress(newPos.lat, newPos.lng)
								updateAddress(newPos.lat, newPos.lng, true)
							}
						}}
					>
						<Popup>{currentInput}</Popup>
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
									updateAddress(newPos.lat, newPos.lng, false)
									// fetchAddress(newPos.lat, newPos.lng)
								}
							}}
						>
							<Popup>{destinationInput}</Popup>
						</Marker>
					)}

					{/* Polyline for Line Between Locations */}
					{route && (
						<Polyline
							positions={route} // Directly use decoded route coordinates
							color="red" // Line color
							weight={4} // Line weight
						/>
					)}
				</MapContainer>
			)}
		</div>
	)
}

export default MapsPreview
