import React, { useMemo } from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import useCreatedAt from "@/hooks/common/created-at"
import { Icons } from "@/components/icons"

interface IMessageCardProps {
  text: string | null
  sentByUser: boolean
  createdAt: string // datetime string
  document?: any
}
const MessageCard: React.FunctionComponent<IMessageCardProps> = ({
  text,
  sentByUser,
  createdAt,
  document,
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
              : " bg-slate-50 shadow-sm dark:bg-slate-600"
          )}
          data-testid="message-card"
        >
          <div
            className="shrink-1 whitespace-pre-wrap break-normal text-start  text-black dark:text-white"
            dangerouslySetInnerHTML={{ __html: linkifiedText }}
          />

          {document ? (
            <Link
              href={document.path}
              className={cn(
                "mt-3 flex flex-col rounded-lg   p-2",
                sentByUser
                  ? " bg-teal-100 dark:bg-teal-800"
                  : "bg-slate-200 dark:bg-slate-900"
              )}
              target="_blank"
              rel="noreferrer"
            >
              <div className="flex flex-row gap-2">
                <Icons.file />
                <p className="break-all">{document.name}</p>
              </div>

              <p className="text-end text-xs">
                {(document.size / 1000).toFixed(1)} kb
              </p>
            </Link>
          ) : null}
        </div>
        <div
          className={cn(
            "flex items-end justify-end rounded-r-2xl text-end text-xs  text-slate-700 dark:text-slate-400",
            sentByUser
              ? "bg-green-300  dark:bg-[#164E63]"
              : " bg-slate-50 shadow-sm dark:bg-slate-600"
          )}
        >
          <p className="mb-1 mr-2">{formattedDate}</p>
        </div>
      </div>
    </div>
  )
}

export default MessageCard
