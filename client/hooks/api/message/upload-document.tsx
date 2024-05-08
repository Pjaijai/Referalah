import { uploadMedia } from "@/utils/common/api"
import { useMutation } from "@tanstack/react-query"

const uploadDocument = async ({ file, path }: { file: File; path: string }) => {
  return uploadMedia({
    bucketName: "conversation_documents",
    file,
    path,
    contentType: "application/pdf",
  })
}
const useUploadDocument = () => {
  return useMutation({
    mutationFn: uploadDocument,
  })
}

export default useUploadDocument
