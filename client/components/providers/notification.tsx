"use client"

import React, { PropsWithChildren, useEffect, useState } from "react"
import firebase from "@/utils/services/firebase/config"
import { getMessaging, getToken, onMessage } from "firebase/messaging"

interface INotificationProviderProps {}
const NotificationProvider: React.FunctionComponent<
  PropsWithChildren<INotificationProviderProps>
> = ({ children }) => {
  const [token, setToken] = useState("")
  const [notificationPermissionStatus, setNotificationPermissionStatus] =
    useState("")

  useEffect(() => {
    const retrieveToken = async () => {
      try {
        if (typeof window !== "undefined" && "serviceWorker" in navigator) {
          const messaging = getMessaging(firebase)

          // Retrieve the notification permission status
          const permission = await Notification.requestPermission()
          setNotificationPermissionStatus(permission)

          // Check if permission is granted before retrieving the token
          if (permission === "granted") {
            const currentToken = await getToken(messaging, {
              vapidKey: `${process.env.NEXT_PUBLIC_FIREBASE_VAPIDKEY}`,
            })
            if (currentToken) {
              setToken(currentToken)
            } else {
              console.log(
                "No registration token available. Request permission to generate one."
              )
            }
          }
        }
      } catch (error) {
        console.log("An error occurred while retrieving token:", error)
      }
    }

    retrieveToken()
  }, [])

  token && console.log("FCM token:", token)

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      const messaging = getMessaging(firebase)
      const unsubscribe = onMessage(messaging, (payload) => {
        console.log("Foreground push notification received:", payload)
        // Handle the received push notification while the app is in the foreground
        // You can display a notification or update the UI based on the payload
      })
      return () => {
        unsubscribe() // Unsubscribe from the onMessage event
      }
    }
  }, [])

  return <>{children}</>
}

export default NotificationProvider
