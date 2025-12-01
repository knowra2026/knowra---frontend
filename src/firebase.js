import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

// 🔥 Authentication
export const auth = getAuth(app);

// 🔥 Google Login Provider
export const googleProvider = new GoogleAuthProvider();

// 🔥 Firestore
export const db = getFirestore(app);

// 🔥 Storage
export const storage = getStorage(app);

// Optional analytics (works only in HTTPS + production)
try {
  getAnalytics(app);
} catch (err) {
  console.log("Analytics not supported in this environment.");
}
