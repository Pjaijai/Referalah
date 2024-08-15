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
    <div className="mt-4 flex flex-row items-end gap-1 ">
      <p className="text-xs font-semibold">{scopedT("so_far")}</p>
      <p className=" text-2xl font-black leading-none text-indigo-600 ">
        {numberOfMembers || "0"}
      </p>
    </div>
  )
}

export default UserCount
