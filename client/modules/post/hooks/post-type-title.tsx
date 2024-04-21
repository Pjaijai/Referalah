import React, { useMemo } from "react"
import { useI18n } from "@/utils/services/internationalization/client"

import { EReferralType } from "@/types/common/referral-type"

const usePostTypeTitle = (type?: EReferralType) => {
  const t = useI18n()
  return useMemo(() => {
    let typeTitle: string | null = null
    switch (type) {
      case EReferralType.HIRING:
        typeTitle = t("post.type.hiring.title")
        break
      case EReferralType.REFEREE:
        typeTitle = t("post.type.referee.title")
        break
      case EReferralType.REFERRER:
        typeTitle = t("post.type.referer.title")
        break
      default:
        break
    }

    return typeTitle
  }, [type])
}

export default usePostTypeTitle
