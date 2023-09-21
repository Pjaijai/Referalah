import { z } from "zod"

export const miniumWordValidation = (min: number) => {
  return z.string().min(min, {
    message: `至少有要${min}粒字`,
  })
}
