// Doc: https://react-dropzone.js.org/

import React, { useCallback } from "react"
import { Accept, useDropzone } from "react-dropzone"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

interface IBaseDropzoneProps {
  acceptMultiple?: boolean
  acceptFileType?: Accept
  onFileDrop?: (acceptedFiles: File[]) => void
  outerClassName?: string
  innerClassName?: string
}
const BaseDropzone: React.FunctionComponent<IBaseDropzoneProps> = ({
  acceptMultiple,
  acceptFileType,
  onFileDrop,
  outerClassName,
  innerClassName,
}) => {
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
      multiple: acceptMultiple || false,
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
        <p>Drag a file here, or click to select a file</p>
        <em>(Only *.jpeg and *.png images will be accepted)</em>
      </div>
    </section>
  )
}

export default BaseDropzone
