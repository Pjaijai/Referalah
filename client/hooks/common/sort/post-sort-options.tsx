import { useI18n } from "@/utils/services/internationalization/client"

const usePostSortOptions = () => {
  const t = useI18n()
  const postSortingOptions = [
    {
      value: "createdAt,dec",
      label: t("search.sorting.created_at_dec"),
    },
    {
      value: "createdAt,asc",
      label: t("search.sorting.created_at_asc"),
    },
    {
      value: "year_of_experience,asc",
      label: t("search.sorting.year_of_experience_asc"),
    },
    {
      value: "year_of_experience,dec",
      label: t("search.sorting.year_of_experience_dec"),
    },
  ]
  return {
    data: postSortingOptions,
  }
}

export default usePostSortOptions
