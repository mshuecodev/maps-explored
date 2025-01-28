"use client"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { auth } from "@/app/firebase/clientApp" // Adjust the import path as needed
import { sendPasswordResetEmail } from "firebase/auth"

const ResetPassword: React.FC = () => {
	const [email, setEmail] = useState("")
	const [message, setMessage] = useState<string | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)
	const router = useRouter()

	const handleResetPassword = async (e: React.FormEvent) => {
		e.preventDefault()
		setLoading(true)
		setError(null)
		setMessage(null)

		try {
			await sendPasswordResetEmail(auth, email)
			setMessage("Password reset email sent. Please check your inbox.")
		} catch (error: any) {
			setError(error.message)
		} finally {
			setLoading(false)
		}
	}

	return (
		<main className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
			<div className="text-center p-8 bg-white rounded-lg shadow-lg w-full max-w-md">
				<h1 className="text-4xl font-extrabold text-gray-800 mb-6">Reset Password</h1>
				{message && <p className="text-green-500 mb-4">{message}</p>}
				{error && <p className="text-red-500 mb-4">{error}</p>}
				<form
					onSubmit={handleResetPassword}
					className="space-y-4"
				>
					<input
						type="email"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
					/>
					<button
						type="submit"
						className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
						disabled={loading}
					>
						{loading ? "Sending..." : "Send Reset Email"}
					</button>
				</form>
				<button
					onClick={() => router.push("/login")}
					className="mt-4 w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
				>
					Back to Login
				</button>
			</div>
		</main>
	)
}

export default ResetPassword
