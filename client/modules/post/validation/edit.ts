import { createPostValidationSchema } from "@/modules/post/validation/create"
import { z } from "zod"

import { PostStatusType } from "@/types/common/post-status"

const editPostValidationSchema = z
  .object({
    status: z.enum(["active", "inactive"]),
  })
  .merge(createPostValidationSchema)

export { editPostValidationSchema }
