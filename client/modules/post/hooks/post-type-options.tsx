import { useI18n } from "@/utils/services/internationalization/client"

import { EPostType } from "@/types/common/post-type"
import { ISelectOption } from "@/components/customized-ui/selects/base"

const usePostTypeOptions = () => {
  const t = useI18n()
  const typeOptions: ISelectOption[] = [
    {
      label: `${t("post.type.referer.title")} (${t(
        "post.type.referer.description"
      )})`,
      value: EPostType.REFERRER,
    },
    {
      label: `${t("post.type.referee.title")} (${t(
        "post.type.referee.description"
      )})`,
      value: EPostType.REFEREE,
    },

    {
      label: `${t("post.type.hiring.title")} (${t(
        "post.type.hiring.description"
      )})`,
      value: EPostType.HIRING,
    },

    {
      label: `${t("post.type.collaboration.title")} (${t(
        "post.type.collaboration.description"
      )})`,
      value: EPostType.COLLABORATION,
    },
  ]
  return typeOptions
}

export default usePostTypeOptions
