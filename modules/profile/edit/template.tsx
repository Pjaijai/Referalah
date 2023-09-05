import React, { useState } from "react"
import Image from "next/image"
import FormCheckBox from "@/modules/profile/form/fields/checkbox"
import InputFileField from "@/modules/profile/form/fields/file"
import InputField from "@/modules/profile/form/fields/input"
import { IViewProfileTemplateProps } from "@/modules/profile/view/template"
import { supabase } from "@/utils/services/supabase/config"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"

interface IEdiProfileTemplate extends IViewProfileTemplateProps {
  slug: string
}

const EditProfileTemplate: React.FunctionComponent<IEdiProfileTemplate> = ({
  photoUrl,
  chineseFirstName,
  chineseLastName,
  englishFirstName,
  englishLastName,
  username,
  description,
  company,
  jobTitle,
  yearOfExperience,
  country,
  province,
  city,
  resumeUrl,
  socialMediaUrl,
  isReferer,
  isReferee,
  slug,
}) => {
  const formSchema = z.object({
    photoUrl: z.any().optional(),
    chineseFirstName: z.string().min(1, {
      message: "Username must be at least 2 characters.",
    }),
    chineseLastName: z.string().min(1, {
      message: "Username must be at least 2 characters.",
    }),
    englishFirstName: z.string().min(1, {
      message: "Username must be at least 2 characters.",
    }),
    englishLastName: z.string().min(1, {
      message: "Username must be at least 2 characters.",
    }),
    username: z.string().min(1, {
      message: "Username must be at least 2 characters.",
    }),
    company: z.string().min(1, {
      message: "Username must be at least 2 characters.",
    }),
    jobTitle: z.string().min(1, {
      message: "Username must be at least 2 characters.",
    }),
    socialMediaUrl: z.string().min(1, {
      message: "Username must be at least 2 characters.",
    }),
    isReferer: z.boolean(),
    isReferee: z.boolean(),
  })

  const [image, setImage] = useState(null)
  const [base64Image, setBase64Image] = useState(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const {
    watch,
    setValue,
    formState: { errors },
  } = form

  const wphotoUrl = watch("photoUrl")
  console.log("wphotoUrl", wphotoUrl)
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    let photoUrl = values.photoUrl
    console.log("asdas", values)
    if (image) {
      const { data, error } = await supabase.storage
        .from("profile_image")
        .upload("test1/avatar1.png", image, {
          cacheControl: "3600",
          upsert: false,
        })
      console.log("data", data)
      console.log("error", error)
      const { data: imageUrl } = await supabase.storage
        .from("profile_image")
        .getPublicUrl("test1/avatar1.png")
      console.log("imageUrl", imageUrl)
      photoUrl = imageUrl.publicUrl
    }

    const { error } = await supabase
      .from("user")
      .update({
        avatar_url: photoUrl,
        chinese_first_name: values.chineseFirstName,
        chinese_last_name: values.chineseLastName,
        english_first_name: values.englishFirstName,
        english_last_name: values.englishLastName,
        username: values.username,
        // description,
        company_name: values.company,
        job_title: values.jobTitle,
        // yearOfExperience,
        // country,
        // province,
        // city,
        // resumeUrl: values.resumeUrl,
        social_media_url: values.socialMediaUrl,
        is_referer: values.isReferer,
        is_referee: values.isReferee,
      })
      .eq("uuid", slug)

    //       photoUrl,
    //   chineseFirstName,
    //   chineseLastName,
    //   englishFirstName,
    //   englishLastName,
    //   username,
    //   description,
    //   company,
    //   jobTitle,
    //   yearOfExperience,
    //   country,
    //   province,
    //   city,
    //   resumeUrl,
    //   socialMediaUrl,
    //   isReferer,
    //   isReferee,
  }

  const handleProfileImageChange = (e) => {
    const imageFile = e.target.files[0]

    setImage(imageFile)
    if (imageFile) {
      const reader = new FileReader()

      reader.onload = (e) => {
        const base64Image = e.target.result
        setBase64Image(base64Image)
      }

      reader.readAsDataURL(imageFile)
    }
  }

  return (
    <div>
      <Form {...form}>
        {base64Image && (
          <Image src={base64Image} width={200} height={200} alt={username} />
        )}

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormCheckBox
            control={form.control}
            label="Is referer"
            name="isReferer"
            description="isReferer"
          />

          <FormCheckBox
            control={form.control}
            label="Is referee"
            name="isReferee"
            description="isReferee"
          />
          <InputFileField
            label="photoUrl"
            name="photoUrl"
            description="photoUrl"
            placeholder="photoUrl"
            onChange={handleProfileImageChange}
          />
          <InputField
            control={form.control}
            label="Chinese First Name"
            name="chineseFirstName"
            description="Enter your Chinese first name"
            placeholder="Chinese First Name"
          />

          <InputField
            control={form.control}
            label="Chinese Last Name"
            name="chineseLastName"
            description="Enter your Chinese last name"
            placeholder="Chinese Last Name"
          />

          <InputField
            control={form.control}
            label="English First Name"
            name="englishFirstName"
            description="Enter your English first name"
            placeholder="English First Name"
          />

          <InputField
            control={form.control}
            label="English Last Name"
            name="englishLastName"
            description="Enter your English last name"
            placeholder="English Last Name"
          />

          <InputField
            control={form.control}
            label="Username"
            name="username"
            description="Enter your username"
            placeholder="Username"
          />

          <InputField
            control={form.control}
            label="Company"
            name="company"
            description="Enter your company name"
            placeholder="Company"
          />

          <InputField
            control={form.control}
            label="Job Title"
            name="jobTitle"
            description="Enter your job title"
            placeholder="Job Title"
          />

          <InputField
            control={form.control}
            label="Social Media URL"
            name="socialMediaUrl"
            description="Enter your social media URL"
            placeholder="Social Media URL"
          />

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  )
}

export default EditProfileTemplate
