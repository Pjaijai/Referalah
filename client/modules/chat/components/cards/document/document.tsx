"use client"

import React from "react"
import Link from "next/link"
import { useI18n } from "@/utils/services/internationalization/client"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

interface IDocumentCardProp {
  url: string
  documentName: string
  documentSize: number
  sentByUser: boolean
  isDocumentExpired: boolean
}
const DocumentCard: React.FunctionComponent<IDocumentCardProp> = ({
  documentName,
  documentSize,
  sentByUser,
  url,
  isDocumentExpired,
}) => {
  const t = useI18n()
  return (
    <>
      {isDocumentExpired ? (
        <div
          className={cn(
            "mt-3 flex flex-col rounded-lg p-2",
            sentByUser
              ? " bg-teal-100 dark:bg-teal-800"
              : "bg-slate-200 dark:bg-slate-900"
          )}
        >
          <div className="flex flex-row gap-2">
            <Icons.file />
            <div className="flex flex-col">
              <p className="break-all">{documentName}</p>
              <p className="text-xs">({t("general.expired")})</p>
            </div>
          </div>
          <p className="text-end text-xs">
            {(documentSize / 1000).toFixed(1)} kb
          </p>
        </div>
      ) : (
        <Link
          href={url}
          className={cn(
            "mt-3 flex flex-col rounded-lg p-2",
            sentByUser
              ? " bg-teal-100 dark:bg-teal-800"
              : "bg-slate-200 dark:bg-slate-900"
          )}
          target="_blank"
          rel="noopener noreferrer nofollow"
        >
          <div className="flex flex-row gap-2">
            <Icons.file />
            <p className="break-all">{documentName}</p>
          </div>
          <p className="text-end text-xs">
            {(documentSize / 1000).toFixed(1)} kb
          </p>
        </Link>
      )}
    </>
  )
}

export default DocumentCard
