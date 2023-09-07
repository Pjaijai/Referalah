import { z } from "zod"

export const maximumWordValidation = (max: number) => {
  return z.string().max(max, {
    message: `俾盡${max}粒字，唔夠用請聯絡我🙏🏻`,
  })
}
