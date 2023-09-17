"use client"

import Link from "next/link"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"

export default function IndexPage() {
  return (
    <>
      <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl  md:text-4xl">
            海外港人搵工，係到搵推薦人，互相支持。
          </h1>
          <p className="max-w-[700px] text-lg text-muted-foreground">
            Accessible and customizable components that you can copy and paste
            into your apps. Free. Open Source. And Next.js 13 Ready.
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            target="_blank"
            rel="noreferrer"
            href={"/about"}
            className={buttonVariants({ variant: "outline" })}
          >
            了解更多
          </Link>
          <Link
            href={"/auth"}
            target="_blank"
            rel="noreferrer"
            className={buttonVariants()}
          >
            登入/註冊
          </Link>
        </div>
      </section>

      <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
        asd
      </section>
    </>
  )
}
