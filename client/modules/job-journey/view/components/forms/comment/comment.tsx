"use client"

import React from "react"
import { useI18n } from "@/utils/services/internationalization/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Form } from "@/components/ui/form"
import FormTextArea from "@/components/customized-ui/form/text-area"

const CommentForm = () => {
  const t = useI18n()
  const commentFormSchema = z.object({
    body: z.string().max(360, {
      message: t("validation.text.maximum_length", { count: 360 }),
    }),
  })

  const form = useForm<z.infer<typeof commentFormSchema>>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: {
      body: "",
    },
  })

  return (
    <Form {...form}>
      <FormTextArea
        control={form.control}
        name="body"
        placeholder={t("chat.form.message_placeholder")}
        inputClassName="overflow-hidden"
        minRows={10}
        maxLength={360}
      />
    </Form>
  )
}

export default CommentForm
