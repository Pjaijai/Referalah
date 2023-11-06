import { createPostValidationSchema } from "@/modules/post/validation/create"
import { z } from "zod"

const editPostValidationSchema = z
  .object({
    status: z.enum(["active", "inactive"]),
  })
  .merge(createPostValidationSchema)

export { editPostValidationSchema }
