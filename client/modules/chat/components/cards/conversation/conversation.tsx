import React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useI18n } from "@/utils/services/internationalization/client"
import { useQueryClient } from "@tanstack/react-query"

import { EQueryKeyString } from "@/types/common/query-key-string"
import { cn } from "@/lib/utils"
import useUpdateConversation from "@/hooks/api/message/update-conversation"
import useCreatedAt from "@/hooks/common/created-at"
import useUserStore from "@/hooks/state/user/store"
import BaseAvatar from "@/components/customized-ui/avatars/base"
import { Icons } from "@/components/icons"

interface IConversationProps {
  username: string
  text: string | null
  isSeen: boolean
  avatarUrl: null | string
  updatedAt: string | null //datetime with timezone
  uuid: string
  type: "sender" | "receiver"
  acceptRequest: boolean
  documentName?: string
}

const ConversationCard: React.FunctionComponent<IConversationProps> = ({
  text,
  isSeen,
  username,
  avatarUrl,
  updatedAt,
  uuid,
  type,
  acceptRequest,
  documentName,
}) => {
  const t = useI18n()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { mutate: update } = useUpdateConversation()
  const { data: formattedDate } = useCreatedAt({ createdAt: updatedAt })

  const truncatedText = text
    ? text.slice(0, 25)
    : documentName
    ? documentName.slice(0, 25)
    : ""
  const queryClient = useQueryClient()
  const currentConversation = searchParams.get("conversation")
  const isCurrentConversation = currentConversation === uuid
  const userUuid = useUserStore((state) => state.uuid)
  const handleClick = async () => {
    if (type === "sender" && !isSeen) {
      update(
        {
          isSenderSeen: true,
          conversationUuid: uuid,
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: [EQueryKeyString.CONVERSATION_LIST, { userUuid }],
            })
          },
        }
      )
    }
    if (type === "receiver" && !isSeen) {
      update(
        {
          isReceiverSeen: true,
          conversationUuid: uuid,
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: [EQueryKeyString.CONVERSATION_LIST, { userUuid }],
            })
          },
        }
      )
    }

    const param = new URLSearchParams()
    param.set("conversation", uuid)
    router.push("?" + param.toString())
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
        "flex w-full flex-row items-center gap-x-3 overflow-hidden rounded-sm p-2 hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700",
        isCurrentConversation && "bg-gray-100 dark:bg-gray-700"
      )}
    >
      <BaseAvatar
        fallBack={username[0]}
        size="medium"
        url={avatarUrl || undefined}
        alt={username}
      />
      <div className="flex w-full flex-col">
        <div className="flex flex-row items-center justify-between ">
          <h4 className="font-semibold">{username}</h4>
          <p className="text-sm text-muted-foreground">{formattedDate}</p>
        </div>

        <div className="relative flex w-full  flex-row items-center justify-between">
          {!acceptRequest && (
            <p className="w-5/6 text-xs text-orange-700 dark:text-blue-400">
              {t("chat.conversation_request")}
            </p>
          )}
          {acceptRequest && (
            <p className="w-5/6 truncate text-muted-foreground">
              {truncatedText}
            </p>
          )}

          {!isSeen && (
            <Icons.bigDot
              className="absolute right-0 text-green-700  dark:text-yellow-300"
              data-testid="unread-big-dot"
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default ConversationCard
