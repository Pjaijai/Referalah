import { Icons } from "@/components/icons"

export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Icons.loader className="animate-spin text-2xl" />
    </div>
  )
}
