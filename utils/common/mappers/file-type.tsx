type TFileTypeMapper = {
  [key: string]: string
}
const fileTypeMapper: TFileTypeMapper = {
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
  "image/png": "png",
  "application/pdf": "pdf",
}

export default fileTypeMapper
