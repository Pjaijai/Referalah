"use client"

import { useEffect } from "react"
import Link from "next/link"
import { supabase } from "@/utils/services/supabase/config"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"

export default function IndexPage() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase.functions.invoke(
          "contactThroughPost",
          {
            body: {
              type: "referer",
              message: "1231232321",
              post_uuid: "1931be34-3782-4d29-8b93-e3d9e852929b",
            },
          }
        )

        if (error) {
          console.error("Error:", error)
        } else {
          console.log("Data:", data)
        }
      } catch (error) {
        console.error("An error occurred:", error)
      }
    }

    fetchData() // Call the asynchronous function to fetch data
  }, [])
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Beautifully designed components <br className=" inline" />
          built with Radix UI and Tailwind CSS.
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Accessible and customizable components that you can copy and paste
          into your apps. Free. Open Source. And Next.js 13 Ready.
        </p>
      </div>
      <div className="flex gap-4">
        <Link
          href={siteConfig.links.docs}
          target="_blank"
          rel="noreferrer"
          className={buttonVariants()}
        >
          Documentation
        </Link>
        <Link
          target="_blank"
          rel="noreferrer"
          href={siteConfig.links.github}
          className={buttonVariants({ variant: "outline" })}
        >
          GitHub
        </Link>
      </div>
    </section>
  )
}
