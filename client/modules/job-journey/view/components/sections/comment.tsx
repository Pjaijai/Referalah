import React from "react"
import CommentCard from "@/modules/job-journey/view/components/cards/comment/comment"
import CommentForm from "@/modules/job-journey/view/components/forms/comment/comment"

import { Separator } from "@/components/ui/separator"

const CommentSection = () => {
  return (
    <div className="basis-1/2">
      <h2 className="text-base font-bold text-slate-700">Comments</h2>

      <Separator />

      <CommentCard />

      <CommentForm />
    </div>
  )
}

export default CommentSection
