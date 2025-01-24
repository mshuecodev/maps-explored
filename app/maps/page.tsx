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
			// router.push(`${basePath}/login`)
			router.push(`/login`)
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
			<div className="w-full h-full">
				<div className="w-full h-full">
					<MapsPreview />
				</div>
			</div>
		</main>
	)
}
