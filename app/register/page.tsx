"use client"
import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/context/AuthContex"

const Register: React.FC = () => {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const router = useRouter()
	const { handleRegister, token, loading } = useAuth()
	const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ""

	const pushToDashboard = () => {
		router.push(`${basePath}/dashboard`)
	}

	const handleRegisterSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		try {
			await handleRegister(email, password)
			console.log("Registration successful, pushing to dashboard...")
			pushToDashboard()
		} catch (error) {
			console.error("Registration failed:", error)
		}
	}

	useEffect(() => {
		if (token) {
			console.log("Token exists, redirecting to dashboard...")
			pushToDashboard()
		}
	}, [token, router])

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
		<main className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
			<div className="text-center p-8 bg-white rounded-lg shadow-lg w-full max-w-md">
				<h1 className="text-4xl font-extrabold text-gray-800 mb-6">Register</h1>
				<form
					onSubmit={handleRegisterSubmit}
					className="space-y-4"
				>
					<input
						type="email"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
					/>
					<input
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
					/>
					<button
						type="submit"
						className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
					>
						Register
					</button>
				</form>
				<p className="mt-4 text-gray-600">Already have an account?</p>
				<a
					href="/login"
					className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition inline-block text-center"
				>
					Login
				</a>
			</div>
		</main>
	)
}

export default Register
