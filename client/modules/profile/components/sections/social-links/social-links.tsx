import React from "react"
import BaseSection from "@/modules/profile/components/sections/base/base"
import { Control, useFieldArray, useFormContext } from "react-hook-form"

import { ESocialLink, TSocialLink } from "@/types/common/social-links"
import { useGetSocialLinkOptions } from "@/hooks/common/get-social-links-options"
import { Button } from "@/components/ui/button"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import BaseSelect from "@/components/customized-ui/selects/base"
import { Icons } from "@/components/icons"

interface SocialLinksSectionProps {
  control: Control<any>
  name: string
}

const detectLinkType = (url: string): TSocialLink => {
  const lowercaseUrl = url.toLowerCase()

  if (lowercaseUrl.includes("linkedin.com")) return ESocialLink.LINKEDIN
  if (lowercaseUrl.includes("instagram.com")) return ESocialLink.INSTAGRAM
  if (lowercaseUrl.includes("threads.net")) return ESocialLink.THREADS
  if (lowercaseUrl.includes("github.com")) return ESocialLink.GITHUB
  if (lowercaseUrl.includes("gitlab.com")) return ESocialLink.GITLAB
  if (lowercaseUrl.includes("twitch.tv")) return ESocialLink.TWITCH
  if (lowercaseUrl.includes("youtube.com") || lowercaseUrl.includes("youtu.be"))
    return ESocialLink.YOUTUBE

  return ESocialLink.CUSTOM
}

const SocialLinksSection: React.FC<SocialLinksSectionProps> = ({
  control,
  name,
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  })
  const { setValue } = useFormContext()
  const options = useGetSocialLinkOptions()

  return (
    <BaseSection title="Social Links">
      <div className="mt-4 flex flex-col gap-8">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="flex max-w-lg flex-col gap-2 rounded-lg bg-slate-50 p-6"
          >
            <div className="flex flex-row items-start justify-start gap-6">
              <span className="font-medium text-slate-500">
                Links #{index + 1}
              </span>
              <button type="button" onClick={() => remove(index)}>
                <Icons.trashBin size={20} className="text-indigo-400" />
              </button>
            </div>

            <div className="flex flex-row items-center gap-4">
              <FormField
                control={control}
                name={`${name}.${index}.type`}
                render={({ field }) => (
                  <FormItem className="basis-1/2">
                    <FormLabel>Platform</FormLabel>
                    <FormControl>
                      <BaseSelect
                        options={options}
                        // onChange={field.onChange}
                        // value={field.value}
                        triggerClassName="w-full"
                        // onBlur={}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name={`${name}.${index}.name`}
                control={control}
                render={({ field: nameField }) => (
                  <FormItem className="basis-1/2">
                    <FormLabel>Custom Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter custom name" {...nameField} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={control}
              name={`${name}.${index}.url`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter URL"
                      {...field}
                      onBlur={(e) => {
                        field.onBlur()
                        const url = e.target.value
                        const type = detectLinkType(url)
                        setValue(`${name}.${index}.type`, type)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}
      </div>
      {fields.length < 5 && (
        <Button
          type="button"
          onClick={() =>
            append({ url: "", type: ESocialLink.CUSTOM, name: "" })
          }
          variant="outline"
        >
          Add Link
        </Button>
      )}
    </BaseSection>
  )
}

export default SocialLinksSection
