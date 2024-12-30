import { useMemo } from "react"
import { useI18n } from "@/utils/services/internationalization/client"

import { EPostType } from "@/types/common/post-type"

type PostTypeConfig = {
  [key in Exclude<EPostType, EPostType.ALL>]: {
    title: string
    textColor: string
    bgColor: string
  }
}

const usePostTypeTitle = (type?: EPostType) => {
  const t = useI18n()

  return useMemo(() => {
    if (
      !type ||
      type === EPostType.ALL ||
      !Object.values(EPostType).includes(type)
    ) {
      return {
        title: "??unknown??",
        textColor: "text-gray-600",
        bgColor: "bg-gray-100",
      }
    }

    const postTypeConfig: PostTypeConfig = {
      [EPostType.HIRING]: {
        title: t("post.type.hiring.title"),
        textColor: "text-teal-600",
        bgColor: "bg-teal-100",
      },
      [EPostType.REFEREE]: {
        title: t("post.type.referee.title"),
        textColor: "text-yellow-600",
        bgColor: "bg-yellow-100",
      },
      [EPostType.REFERRER]: {
        title: t("post.type.referer.title"),
        textColor: "text-indigo-600",
        bgColor: "bg-indigo-100",
      },
      [EPostType.COLLABORATION]: {
        title: t("post.type.collaboration.title"),
        textColor: "text-blue-600",
        bgColor: "bg-blue-100",
      },
    }

    return postTypeConfig[type]
  }, [type, t])
}

export default usePostTypeTitle
