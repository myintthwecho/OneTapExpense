import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import {
    browserLocalPersistence,
    getAuth,
    getReactNativePersistence,
    initializeAuth,
    setPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Debug: Log config to verify env vars are loading
console.log("🔧 Firebase Configuration:", {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  hasApiKey: !!firebaseConfig.apiKey,
  environment: process.env.NODE_ENV,
});

const app = initializeApp(firebaseConfig);

// Use AsyncStorage-backed persistence on native to avoid web-only auth persistence errors.
export const auth =
  Platform.OS === "web"
    ? getAuth(app)
    : initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });
export const db = getFirestore(app);

console.log("✅ Firebase initialized successfully");

// Enable persistent auth sessions for web only (native uses initializeAuth persistence).
if (Platform.OS === "web") {
  setPersistence(auth, browserLocalPersistence)
    .then(() => {
      console.log("Auth persistence enabled");
    })
    .catch((error) => {
      console.error("Auth persistence error:", error);
    });
}

export default app;
