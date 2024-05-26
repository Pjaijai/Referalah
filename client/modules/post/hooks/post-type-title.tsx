import { useMemo } from "react"
import { useI18n } from "@/utils/services/internationalization/client"

import { EPostType } from "@/types/common/post-type"

const usePostTypeTitle = (type?: EPostType) => {
  const t = useI18n()
  return useMemo(() => {
    let typeTitle: string | null = null
    switch (type) {
      case EPostType.HIRING:
        typeTitle = t("post.type.hiring.title")
        break
      case EPostType.REFEREE:
        typeTitle = t("post.type.referee.title")
        break
      case EPostType.REFERRER:
        typeTitle = t("post.type.referer.title")
        break
      case EPostType.COLLABORATION:
        typeTitle = t("post.type.collaboration.title")
        break
      default:
        break
    }

    return typeTitle
  }, [type])
}

export default usePostTypeTitle
