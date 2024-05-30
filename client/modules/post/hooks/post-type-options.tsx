import { useI18n } from "@/utils/services/internationalization/client"

import { EPostType } from "@/types/common/post-type"
import { ISelectOption } from "@/components/customized-ui/selects/base"

const usePostTypeOptions = () => {
  const t = useI18n()
  const typeOptions: ISelectOption[] = [
    {
      title: `${t("post.type.referer.title")} (${t(
        "post.type.referer.description"
      )})`,
      value: EPostType.REFERRER,
    },
    {
      title: `${t("post.type.referee.title")} (${t(
        "post.type.referee.description"
      )})`,
      value: EPostType.REFEREE,
    },

    {
      title: `${t("post.type.hiring.title")} (${t(
        "post.type.hiring.description"
      )})`,
      value: EPostType.HIRING,
    },

    {
      title: `${t("post.type.collaboration.title")} (${t(
        "post.type.collaboration.description"
      )})`,
      value: EPostType.COLLABORATION,
    },
  ]
  return typeOptions
}

export default usePostTypeOptions
