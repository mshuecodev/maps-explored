"use client"
import { useState, useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import type { LatLngTuple } from "leaflet"
import "leaflet/dist/leaflet.css"
import { useAuth } from "@/app/context/AuthContex"
import { useRouter } from "next/navigation"
import MapsPreview from "@/app/components/MapsPreview"

export default function Home() {
	const { loading, token, handleLogout } = useAuth()
	const router = useRouter()
	const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ""

	useEffect(() => {
		if (!loading && !token) {
			router.push(`${basePath}/login`)
		}
	}, [token, loading, router])

	if (loading) {
		return (
			<main className="min-h-screen flex items-center justify-center bg-gray-100">
				<div className="text-center">
					<p className="text-gray-600">Loading...</p>
				</div>
			</main>
		)
	}

	return (
		<main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
			<div className="w-full ">
				<div className="text-center p-8 bg-white rounded-lg shadow-lg">
					<div className="flex justify-between mb-4">
						<button
							onClick={() => router.back()}
							className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
						>
							Back
						</button>
						<button
							onClick={handleLogout}
							className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
						>
							Logout
						</button>
					</div>
					<MapsPreview />
				</div>
			</div>
		</main>
	)
}
