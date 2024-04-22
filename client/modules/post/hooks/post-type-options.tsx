import { useI18n } from "@/utils/services/internationalization/client"

import { EReferralType } from "@/types/common/referral-type"
import { ISelectOption } from "@/components/customized-ui/selects/base"

const usePostTypeOptions = () => {
  const t = useI18n()
  const typeOptions: ISelectOption[] = [
    {
      title: t("post.type.referer.title"),
      value: EReferralType.REFERRER,
    },
    {
      title: t("post.type.referee.title"),
      value: EReferralType.REFEREE,
    },
    {
      title: t("post.type.hiring.title"),
      value: EReferralType.HIRING,
    },
  ]
  return typeOptions
}

export default usePostTypeOptions
