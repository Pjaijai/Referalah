"use client"

import Link from "next/link"
import { BaseNavigationMenu } from "@/components/customized-ui/navigation-menu/base"
import { buttonVariants } from "@/components/ui/button"
import useUserStore from "@/hooks/state/user/useUserStore"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"
import useGetUserCount from "@/hooks/api/user/useGetUserCount"

export default function IndexPage() {
  
  const isUserSignIn = useUserStore(state=> state.isSignIn)
  const {data}= useGetUserCount()
  return (
    <>
    <div>
 
      </div>
      <div className="flex md:hidden justify-center mt-4">
        <BaseNavigationMenu />
      </div>
      <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl  md:text-4xl">
            海外港人搵工搵Referral。
          </h1>
          <p className="max-w-[700px] text-lg text-muted-foreground">
            希望呢個平台幫到大家！祝大家一切順利！
          </p>
        </div>
        <div className={`${isUserSignIn ? 'flex gap-4' : 'flex flex-wrap gap-4'}`}>
          <Link
            href={"/about"}
            className={buttonVariants({ variant: isUserSignIn ?  'default' :'outline' })}
          >
            了解更多
          </Link>

          <Link
            href={"https://instagram.com/referalah?igshid=NGVhN2U2NjQ0Yg=="}
            className={cn(buttonVariants({ variant: isUserSignIn ?  'default' :'outline' }), 'gap-2')}
        
          >
            <Icons.instagram/>
            Instagram
          </Link>
          {
            !isUserSignIn && <Link href={"/auth"} className={buttonVariants()}>
            登入/註冊
          </Link>
          }
            <h2 className="text-end text-sm mt-4 border-b-2 border-green-700 dark:border-yellow-300"><span className="text-green-700
] dark:text-yellow-300  font-bold">{data || '0'}</span>個會員</h2>
        </div>
     
      </section>
      
    </>
  )
}
