// Import the required Firebase modules
import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth, setPersistence, browserSessionPersistence, browserLocalPersistence, GoogleAuthProvider } from "firebase/auth"

// Your Firebase configuration object
const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
	measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

setPersistence(auth, browserSessionPersistence).catch((error) => {
	console.error("Error setting persistence:", error)
})

const googleProvider = new GoogleAuthProvider()

export { auth, googleProvider }
