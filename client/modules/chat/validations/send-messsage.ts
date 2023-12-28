import { z } from "zod"

export const sendMessageInFormSchema = z.object({
  message: z
    .string()
    .min(1, { message: "Message is required" })
    .max(10000, { message: "Message must be at most 4000 characters" }),
})
