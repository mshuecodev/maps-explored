"use client"
import { useAuth } from "@/app/context/AuthContex"

export default function Home() {
	const { user, loading, token } = useAuth()
	const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ""

	const handleSignOut = async () => {
		try {
			const response = await fetch("/api/auth/logout", {
				method: "POST"
			})
			if (response.ok) {
				console.log("Logged out successfully")
			} else {
				console.error("Error logging out")
			}
		} catch (error) {
			console.error("Error logging out:", error)
		}
	}

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
			<div className="text-center p-8 bg-white rounded-lg shadow-lg">
				<h1 className="text-5xl font-extrabold text-gray-800 mb-4">Welcome to My App</h1>
				{user ? (
					<>
						<p className="mt-4 text-gray-600">Welcome, {user.email}</p>

						<div className="mt-6 flex justify-center space-x-4">
							<button
								onClick={handleSignOut}
								className="mt-6 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
							>
								Sign Out
							</button>
							<a
								href={`${basePath}/dasdhboard`}
								className="mt-6 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition inline-block text-center"
							>
								Dashboard
							</a>
						</div>
					</>
				) : (
					<>
						<p className="mt-4 text-gray-600">This is the home page.</p>
						<div className="mt-6 flex justify-center space-x-4">
							<a
								href={`${basePath}/login`}
								className="px-6 py-3 bg-white text-blue-500 border border-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition"
							>
								Login
							</a>
							<a
								href={`${basePath}/register`}
								className="px-6 py-3 bg-white text-purple-500 border border-purple-500 rounded-lg hover:bg-purple-500 hover:text-white transition"
							>
								Register
							</a>
						</div>
					</>
				)}
			</div>
		</main>
	)
}
