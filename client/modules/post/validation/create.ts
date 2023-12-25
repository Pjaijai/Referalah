import { maximumWordValidation } from "@/modules/profile/form/validation.ts/max-word"
import { z } from "zod"

const createPostValidationSchema = z.object({
  url: maximumWordValidation(20000)
    .url({
      message: "無效連結",
    })
    .optional()
    .or(z.literal("")),
  description: z
    .string()
    .max(3000, {
      message: `俾盡3000粒字，唔夠用請聯絡我🙏🏻`,
    })
    .min(10, {
      message: `至少有要10粒字`,
    }),

  countryUuid: z.string().min(1, {
    message: `幫手填下🙏🏻`,
  }),
  provinceUuid: z.string().min(1, {
    message: `幫手填下🙏🏻`,
  }),
  cityUuid: z.string().min(1, {
    message: `幫手填下🙏🏻`,
  }),
  industryUuid: z.string().min(1, {
    message: `幫手填下🙏🏻`,
  }),
  yearOfExperience: z
    .string()
    .min(1, {
      message: `幫手填下🙏🏻`,
    })
    .refine(
      (value) => {
        if (value) {
          const number = parseFloat(value)
          if (!isNaN(number) && number >= 0 && number <= 100) {
            return true
          } else {
            return false
          }
        }

        return true
        // Check if it's a valid number and falls within the range 1 to 100
      },
      {
        message: "必須喺0到100之間，如果唔夠用請聯絡我🙇🏻‍♂️", // Specify the custom error message here
      }
    ),
  companyName: z
    .string()
    .min(1, {
      message: `幫手填下🙏🏻`,
    })
    .max(30, {
      message: `俾盡30粒字，唔夠用請聯絡我🙏🏻`,
    }),
  jobTitle: z
    .string()
    .min(1, {
      message: `幫手填下🙏🏻`,
    })
    .max(30, {
      message: `俾盡30粒字，唔夠用請聯絡我🙏🏻`,
    }),
})

export { createPostValidationSchema }
