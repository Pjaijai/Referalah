import { createPostValidationSchema } from "@/modules/post/validation/create"
import { z } from "zod"

const editPostValidationSchema = z.object({}).merge(createPostValidationSchema)

export { editPostValidationSchema }
