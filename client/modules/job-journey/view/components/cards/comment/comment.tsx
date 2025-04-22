"use client"

import React from "react"

import BaseAvatar from "@/components/customized-ui/avatars/base"

const CommentCard = () => {
  return (
    <div>
      <BaseAvatar
        url={"photoUrl"}
        alt={"username"}
        // fallBack={username && username[0]}
        fallBack={"K"}
        size="medium"
        className="h-10 w-10 "
        fallbackClassName=" font-normal text-base "
      />
      <div>
        <p>@k12344</p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Ut enim ad minim veniam, quis nostrud
          exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat
          aliquip ex aliquip exfdgd.
        </p>
      </div>
    </div>
  )
}

export default CommentCard
