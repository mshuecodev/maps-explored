"use client"
import React, { createContext, useContext, useState, useEffect } from "react"
import { User, onIdTokenChanged, getIdToken, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, signInWithPopup } from "firebase/auth"
import { auth, googleProvider, db } from "@/app/firebase/clientApp"
import { getFirestore, doc, setDoc } from "firebase/firestore"

interface AuthContextProps {
	user: User | null
	loading: boolean
	token: string | null
	login: (email: string, password: string) => Promise<void>
	handleLogout: () => Promise<void>
	handleRegister: (email: string, password: string) => Promise<void>
	loginWithGoogle: () => Promise<void>
}

const AuthContext = createContext<AuthContextProps>({
	user: null,
	loading: true,
	token: null,
	login: async () => {},
	handleLogout: async () => {},
	handleRegister: async () => {},
	loginWithGoogle: async () => {}
})

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState(true)
	const [token, setToken] = useState<string | null>(null)

	const loginWithGoogle = async () => {
		const userCredential = await signInWithPopup(auth, googleProvider)
		console.log("User logged in with Google:", userCredential.user)
		const token = await getIdToken(userCredential.user)
		setUser(userCredential.user)
		setToken(token)
	}

	const login = async (email: string, password: string) => {
		try {
			const userCredential = await signInWithEmailAndPassword(auth, email, password)

			const token = await getIdToken(userCredential.user)
			setUser(userCredential.user)
			setToken(token)
		} catch (error: any) {
			// Throw the error for the caller to handle
			throw new Error(error.message)
		}
	}

	const handleRegister = async (email: string, password: string) => {
		const userCredential = await createUserWithEmailAndPassword(auth, email, password)
		const user = userCredential.user
		const token = await getIdToken(userCredential.user)

		// Save user details to Firestore
		await setDoc(doc(db, "users", user.uid), {
			email: user.email,
			uid: user.uid,
			createdAt: new Date().toISOString(),
			// Add custom fields
			role: "user", // Default role
			active: true // Default account status
		})
		setUser(user)
		setToken(token)
	}

	const handleLogout = async () => {
		await signOut(auth)
		setUser(null)
		setToken(null)
	}

	// refresh token function
	const checkTokenExpiration = async () => {
		if (user) {
			const token = await getIdToken(user, true) // Force refresh the token
			setToken(token)
		}
	}

	// force logout after 30 minutes
	useEffect(() => {
		if (user) {
			const timer = setTimeout(() => {
				console.log("Forcing logout after 30 minutes")
				handleLogout()
			}, 30 * 60 * 1000) // Force logout after 30 minutes

			return () => clearTimeout(timer)
		}
	}, [user])

	useEffect(() => {
		const unsubscribe = onIdTokenChanged(auth, async (user) => {
			setUser(user)
			setLoading(false)
			if (user) {
				const token = await getIdToken(user)

				setToken(token)
			} else {
				setToken(null)
			}
		})

		return () => {
			unsubscribe()
		}
	}, [])

	// check expired token every 15 minutes
	useEffect(() => {
		const interval = setInterval(checkTokenExpiration, 15 * 60 * 1000) // Check every 15 minutes
		return () => clearInterval(interval)
	}, [user])

	return <AuthContext.Provider value={{ user, loading, token, login, handleRegister, handleLogout, loginWithGoogle }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
