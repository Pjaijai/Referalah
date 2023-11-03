import { createPostValidationSchema } from "@/modules/post/validation/create"
import { z } from "zod"

import { PostStatus } from "@/types/common/post-status"

const editPostValidationSchema = z
  .object({
    status: z.enum([PostStatus.ACTIVE, PostStatus.INACTIVE]),
  })
  .merge(createPostValidationSchema)

export { editPostValidationSchema }
