// Firebase Integration for NuVida
import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAnalytics, isSupported as isAnalyticsSupported } from 'firebase/analytics'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyARQbDVy6lkbh68ZaFnn_BJ_oKyNXHmfok",
  authDomain: "nuvida-8f975.firebaseapp.com",
  projectId: "nuvida-8f975",
  storageBucket: "nuvida-8f975.firebasestorage.app",
  messagingSenderId: "744363290691",
  appId: "1:744363290691:web:a676743e7172cd6c34e4f6",
  measurementId: "G-VENPZ7FYXF"
}

// Initialize Firebase app singleton
export const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp()

// Firebase Services
export const auth = getAuth(firebaseApp)
export const db = getFirestore(firebaseApp)
export const storage = getStorage(firebaseApp)
export const googleProvider = new GoogleAuthProvider()

// Analytics (Only initialized in browser environments supporting it)
export let analytics: any = null
if (typeof window !== 'undefined') {
  isAnalyticsSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(firebaseApp)
    }
  }).catch(() => { /* analytics fallback */ })
}
