"use client"
import { useAuth } from "@/app/context/AuthContex"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const Dashboard: React.FC = () => {
	const { user, loading, token, handleLogout } = useAuth()
	const router = useRouter()

	useEffect(() => {
		if (!loading && !token) {
			router.push("/login")
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
		<main className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
			<div className="text-center p-8 bg-white rounded-lg shadow-lg w-full max-w-4xl">
				<h1 className="text-4xl font-extrabold text-gray-800 mb-6">Dashboard</h1>
				{user ? (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						<div className="text-left text-gray-700 space-y-2">
							<p>
								<strong>Display Name:</strong> {user.displayName || "N/A"}
							</p>
							<p>
								<strong>Email:</strong> {user.email}
							</p>
							<p>
								<strong>Photo URL:</strong>{" "}
								{user.photoURL ? (
									<img
										src={user.photoURL}
										alt="User Photo"
										className="rounded-full w-16 h-16 mx-auto"
									/>
								) : (
									"N/A"
								)}
							</p>
							<p>
								<strong>UID:</strong> {user.uid}
							</p>
							<p>
								<strong>Email Verified:</strong> {user.emailVerified ? "Yes" : "No"}
							</p>
							<p>
								<strong>Phone Number:</strong> {user.phoneNumber || "N/A"}
							</p>
							<p>
								<strong>Provider ID:</strong> {user.providerId}
							</p>
						</div>
						<div className="text-left text-gray-700 space-y-2">
							<h2 className="text-2xl font-bold mb-4">Features</h2>
							<ul className="list-disc list-inside">
								<li>
									<a
										href="/maps"
										className="text-blue-500 hover:underline"
									>
										Maps
									</a>
								</li>
								<li>
									<a
										href="/feature2"
										className="text-blue-500 hover:underline"
									>
										Feature 2
									</a>
								</li>
								<li>
									<a
										href="/feature3"
										className="text-blue-500 hover:underline"
									>
										Feature 3
									</a>
								</li>
								<li>
									<a
										href="/feature4"
										className="text-blue-500 hover:underline"
									>
										Feature 4
									</a>
								</li>
							</ul>
						</div>
					</div>
				) : (
					<p className="text-gray-700">You are not logged in.</p>
				)}
				{user && (
					<button
						onClick={handleLogout}
						className="mt-6 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
					>
						Logout
					</button>
				)}
			</div>
		</main>
	)
}

export default Dashboard
