import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import {
  fetchAndActivate,
  getRemoteConfig,
  getValue,
} from "firebase/remote-config"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

const firebase = initializeApp(firebaseConfig)
const fireStore = getFirestore(firebase)

let remoteConfig: any = null
if (typeof window !== "undefined") {
  remoteConfig = getRemoteConfig(firebase)
  remoteConfig.settings.minimumFetchIntervalMillis = 3600000 // Optional:
}

// Function to get a feature flag from Remote Config
const getFeatureFlag = async (flagKey: string) => {
  try {
    // Fetch and activate Remote Config values
    await fetchAndActivate(remoteConfig)

    // Get the value of the feature flag
    const flagValue = getValue(remoteConfig, flagKey)

    // Return the value based on its type (boolean, string, number, etc.)
    return flagValue.asBoolean() // Use asString(), asNumber(), etc., based on your flag type
  } catch (error) {
    return false // Return a default value in case of error
  }
}
export { firebase, fireStore, getFeatureFlag }
