"use client"

// Doc: https://react-dropzone.js.org/
import React, { useCallback } from "react"
import { useI18n } from "@/utils/services/internationalization/client"
import { Accept, useDropzone } from "react-dropzone"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

interface IBaseDropzoneProps {
  isMultiple?: boolean
  acceptFileType?: Accept
  onFileDrop?: (acceptedFiles: File[]) => void
  outerClassName?: string
  innerClassName?: string
  title?: string
  description?: string
  maxFileSize?: number // in kb
  maxStorageDay?: number // in days
}
const BaseDropzone: React.FunctionComponent<IBaseDropzoneProps> = ({
  isMultiple,
  acceptFileType,
  onFileDrop,
  outerClassName,
  innerClassName,
  title,
  description,
  maxFileSize,
  maxStorageDay,
}) => {
  const t = useI18n()
  const titleText = title
    ? title
    : isMultiple
    ? t("genera.dropzone.plural.drop_here_select_a_file")
    : t("genera.dropzone.single.drop_here_select_a_file")

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (typeof onFileDrop === "function") {
        onFileDrop(acceptedFiles)
      }
    },
    [onFileDrop]
  )

  const { acceptedFiles, fileRejections, getRootProps, getInputProps } =
    useDropzone({
      multiple: isMultiple || false,
      accept: acceptFileType,
      onDrop,
    })

  return (
    <section className={cn(outerClassName)}>
      <div
        {...getRootProps({
          className: cn(
            "flex flex-col items-center justify-center space-y-4 rounded-lg border-2 border-dashed",
            innerClassName
          ),
        })}
      >
        <input {...getInputProps()} />
        <Icons.file height={90} width={90} />
        <p>{titleText}</p>
        {description && <em>{description}</em>}
        {!!maxFileSize && (
          <em>
            ({t("genera.max_media_kb_size_count", { count: maxFileSize })})
          </em>
        )}
        {!!maxStorageDay && (
          <em>({t("genera.max_storage_day", { count: maxStorageDay })})</em>
        )}
      </div>
    </section>
  )
}

export default BaseDropzone
