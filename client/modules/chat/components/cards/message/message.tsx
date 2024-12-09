import React, { useMemo } from "react"
import DocumentCard from "@/modules/chat/components/cards/document/document"

import { cn } from "@/lib/utils"
import useCreatedAt from "@/hooks/common/created-at"

interface IMessageCardProps {
  text: string | null
  sentByUser: boolean
  createdAt: string // datetime string
  document?: any
  isDocumentExpired: boolean
}
const MessageCard: React.FunctionComponent<IMessageCardProps> = ({
  text,
  sentByUser,
  createdAt,
  document,
  isDocumentExpired,
}) => {
  const { data: formattedDate } = useCreatedAt({ createdAt })

  const linkify = (text: string | null) => {
    if (!text) return ""
    var urlRegex =
      /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi

    return text.replace(urlRegex, function (url: string) {
      return (
        '<a target="_blank" style="text-decoration: underline;" href="' +
        url +
        '">' +
        url +
        "</a>"
      )
    })
  }

  const linkifiedText = useMemo(() => linkify(text), [text])
  return (
    <div
      className={cn(
        "flex w-full justify-end",
        sentByUser ? "justify-end" : " justify-start "
      )}
    >
      <div className="flex w-fit max-w-[70%] flex-row">
        <div
          className={cn(
            " flex flex-col rounded-l-2xl p-3",
            sentByUser
              ? "bg-green-300 dark:bg-[#164E63] "
              : " bg-white  shadow-sm dark:bg-slate-600"
          )}
          data-testid="message-card"
        >
          <div
            className="shrink-1 whitespace-pre-wrap break-normal text-start  text-black dark:text-white"
            dangerouslySetInnerHTML={{ __html: linkifiedText }}
          />

          {document ? (
            <DocumentCard
              documentName={document.name}
              documentSize={document.size}
              sentByUser={sentByUser}
              url={document.path}
              isDocumentExpired={isDocumentExpired}
            />
          ) : null}
        </div>
        <div
          className={cn(
            "flex items-end justify-end rounded-r-2xl text-end text-xs  text-slate-700 dark:text-slate-400",
            sentByUser
              ? "bg-green-300  dark:bg-[#164E63]"
              : " bg-white shadow-sm dark:bg-slate-600"
          )}
        >
          <p className="mb-1 mr-2">{formattedDate}</p>
        </div>
      </div>
    </div>
  )
}

export default MessageCard
