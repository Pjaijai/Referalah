import React from "react"

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
  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        <BaseDropzone
          acceptFileType={{ "application/pdf": [".pdf"] }}
          innerClassName="h-full"
          outerClassName="h-96 p-4"
          onFileDrop={onFileDrop}
        />
      </DrawerContent>
    </Drawer>
  )
}

export default FileUploadDrawer
