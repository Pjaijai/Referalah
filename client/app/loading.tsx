import { Icons } from "@/components/icons"

export default function Loading() {
  return (
    <div className="h-screen flex justify-center items-center">
      <Icons.loader className="animate-spin text-2xl" />
    </div>
  )
}
