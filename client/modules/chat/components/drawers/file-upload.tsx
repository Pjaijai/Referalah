"use client"

import React from "react"
import { useI18n } from "@/utils/services/internationalization/client"

import { Drawer, DrawerContent } from "@/components/ui/drawer"
import BaseDropzone from "@/components/customized-ui/dropzones/base"

interface IFileUploadDrawerProps {
  onFileDrop: (acceptedFiles: File[]) => void
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}
const FileUploadDrawer: React.FunctionComponent<IFileUploadDrawerProps> = ({
  onFileDrop,
  isOpen,
  onOpenChange,
}) => {
  const t = useI18n()
  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        <BaseDropzone
          acceptFileType={{ "application/pdf": [".pdf"] }}
          innerClassName="h-full"
          outerClassName="h-96 p-4"
          description={`${t("genera.dropzone.only_accept_pdf")}`}
          maxFileSize={100}
          onFileDrop={onFileDrop}
          maxStorageDay={7}
        />
      </DrawerContent>
    </Drawer>
  )
}

export default FileUploadDrawer
