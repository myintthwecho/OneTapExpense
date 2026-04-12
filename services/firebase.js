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

const requiredFirebaseConfig = [
  { envKey: "EXPO_PUBLIC_FIREBASE_API_KEY", value: firebaseConfig.apiKey },
  {
    envKey: "EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN",
    value: firebaseConfig.authDomain,
  },
  {
    envKey: "EXPO_PUBLIC_FIREBASE_PROJECT_ID",
    value: firebaseConfig.projectId,
  },
  {
    envKey: "EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET",
    value: firebaseConfig.storageBucket,
  },
  {
    envKey: "EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    value: firebaseConfig.messagingSenderId,
  },
  { envKey: "EXPO_PUBLIC_FIREBASE_APP_ID", value: firebaseConfig.appId },
];

const missingFirebaseKeys = requiredFirebaseConfig
  .filter((entry) => !entry.value)
  .map((entry) => entry.envKey);

export const firebaseInitError =
  missingFirebaseKeys.length > 0
    ? `Missing Firebase env vars: ${missingFirebaseKeys.join(", ")}`
    : null;

const isDev = __DEV__;

if (isDev) {
  console.log("Firebase config loaded", {
    projectId: firebaseConfig.projectId,
    hasApiKey: !!firebaseConfig.apiKey,
  });
}

let app = null;
let auth = null;
let db = null;

if (!firebaseInitError) {
  app = initializeApp(firebaseConfig);

  // Use AsyncStorage-backed persistence on native to avoid web-only auth persistence errors.
  auth =
    Platform.OS === "web"
      ? getAuth(app)
      : initializeAuth(app, {
          persistence: getReactNativePersistence(AsyncStorage),
        });
  db = getFirestore(app);
} else {
  console.error(firebaseInitError);
}

export { app, auth, db };

if (isDev) {
  console.log("Firebase initialized successfully");
}

// Enable persistent auth sessions for web only (native uses initializeAuth persistence).
if (Platform.OS === "web" && auth) {
  setPersistence(auth, browserLocalPersistence)
    .then(() => {
      if (isDev) {
        console.log("Auth persistence enabled");
      }
    })
    .catch((error) => {
      console.error("Auth persistence error:", error);
    });
}

export default app;
