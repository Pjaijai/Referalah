import { useI18n } from "@/utils/services/internationalization/client"

const useReferralSortOptions = () => {
  const t = useI18n()
  const referralSortingOptions = [
    {
      value: "year_of_experience,ace",
      title: t("search.sorting.year_of_experience_asc"),
    },
    {
      value: "year_of_experience,dec",
      title: t("search.sorting.year_of_experience_dec"),
    },
  ]
  return {
    data: referralSortingOptions,
  }
}

export default useReferralSortOptions
