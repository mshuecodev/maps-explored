function decodePolyline(polyline: any) {
	let points = []
	let index = 0,
		lat = 0,
		lng = 0

	while (index < polyline.length) {
		let b,
			shift = 0,
			result = 0
		do {
			b = polyline.charCodeAt(index++) - 63
			result |= (b & 0x1f) << shift
			shift += 5
		} while (b >= 0x20)
		let dlat = result & 1 ? ~(result >> 1) : result >> 1
		lat += dlat

		shift = 0
		result = 0
		do {
			b = polyline.charCodeAt(index++) - 63
			result |= (b & 0x1f) << shift
			shift += 5
		} while (b >= 0x20)
		let dlng = result & 1 ? ~(result >> 1) : result >> 1
		lng += dlng

		points.push([lat / 1e5, lng / 1e5])
	}

	return points
}

export { decodePolyline }
