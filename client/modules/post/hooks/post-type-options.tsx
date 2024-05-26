import { useI18n } from "@/utils/services/internationalization/client"

import { EPostType } from "@/types/common/post-type"
import { ISelectOption } from "@/components/customized-ui/selects/base"

const usePostTypeOptions = () => {
  const t = useI18n()
  const typeOptions: ISelectOption[] = [
    {
      title: t("post.type.referer.title"),
      value: EPostType.REFERRER,
    },
    {
      title: t("post.type.referee.title"),
      value: EPostType.REFEREE,
    },
    {
      title: t("post.type.hiring.title"),
      value: EPostType.HIRING,
    },
    {
      title: t("post.type.collaboration.title"),
      value: EPostType.COLLABORATION,
    },
  ]
  return typeOptions
}

export default usePostTypeOptions
