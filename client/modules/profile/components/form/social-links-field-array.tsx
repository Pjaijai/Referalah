import React from "react"
import { Control, useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import FormTextInput from "@/components/customized-ui/form/input"
import FormSelect from "@/components/customized-ui/form/select"

const linkSchema = z.object({
  url: z.string().url("Invalid URL"),
  type: z.enum(["linkedin", "instagram", "x", "github", "other"]),
})

export type LinkFormValues = z.infer<typeof linkSchema>

interface SocialLinksFieldArrayProps {
  control: Control<any>
  name: string
}

const SocialLinksFieldArray: React.FC<SocialLinksFieldArrayProps> = ({
  control,
  name,
}) => {
  const { fields, append, remove, update } = useFieldArray({
    control,
    name,
  })

  const detectLinkType = (url: string) => {
    console.log(888, url)
    if (url.includes("linkedin.com")) return "linkedin"
    if (url.includes("instagram.com")) return "instagram"
    if (url.includes("twitter.com") || url.includes("x.com")) return "x"
    if (url.includes("github.com")) return "github"
    return "other"
  }

  return (
    <div>
      {fields.map((field, index) => (
        <div key={field.id} className="mb-4 flex items-end gap-2">
          {/* <Input
            // control={control}
            name={`${name}.${index}.url`}
            // label={`Social Media URL ${index + 1}`}
            value={field.url}
            onChange={(e) => {
              console.log(7676, e.target.value, field)
              const url = e.target.value
              const type = detectLinkType(e.target.value)
              update(index, { ...field, url, type })
            }}
          />
          <FormSelect
            control={control}
            name={`${name}.${index}.type`}
            label="Link Type"
            options={[
              { value: "linkedin", label: "LinkedIn" },
              { value: "instagram", label: "Instagram" },
              { value: "x", label: "X (Twitter)" },
              { value: "github", label: "GitHub" },
              { value: "other", label: "Other" },
            ]}
          /> */}
          <Button
            type="button"
            onClick={() => remove(index)}
            variant="destructive"
          >
            Remove
          </Button>
        </div>
      ))}
      <Button
        type="button"
        onClick={() => append({ url: "", type: "other" })}
        variant="outline"
      >
        Add Link
      </Button>
    </div>
  )
}

export default SocialLinksFieldArray
