import React from "react"
import { useScopedI18n } from "@/utils/services/internationalization/client"

interface IUserCountProps {
  numberOfMembers?: number | null
}
const UserCount: React.FunctionComponent<IUserCountProps> = ({
  numberOfMembers,
}) => {
  const scopedT = useScopedI18n("index")

  return (
    <div className="mt-4 flex flex-row gap-1 ">
      <h2>{scopedT("so_far")}</h2>:{" "}
      <div
        className="
      flex flex-row border-green-700 font-bold text-green-700  dark:border-yellow-300 dark:text-yellow-300"
      >
        <h2
          className="
      flex flex-row pb-1 font-bold underline"
        >
          {numberOfMembers || "0"}
        </h2>
        <h2>{scopedT("members", { count: 1 })}</h2>
      </div>
    </div>
  )
}

export default UserCount
