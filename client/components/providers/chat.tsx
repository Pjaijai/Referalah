"use client"

import React, { PropsWithChildren, useEffect } from "react"

import useCheckHasConversationUnseen from "@/hooks/api/message/check-has-conversation-unseen"
import useUserStore from "@/hooks/state/user/store"

interface IChatProviderProps {}
const ChatProvider: React.FunctionComponent<
  PropsWithChildren<IChatProviderProps>
> = ({ children }) => {
  const userUuid = useUserStore((state) => state.uuid)
  const setConversationSeen = useUserStore((state) => state.setConversationSeen)
  const { data, error } = useCheckHasConversationUnseen(userUuid)
  useEffect(() => {
    if (data && !error) {
      setConversationSeen(data)
    }
  }, [data, error])

  return <>{children}</>
}

export default ChatProvider
