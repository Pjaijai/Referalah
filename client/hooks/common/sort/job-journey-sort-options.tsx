import { useI18n } from "@/utils/services/internationalization/client"

const useJobJourneySortOptions = () => {
  const t = useI18n()
  const options = [
    {
      value: "lastUpdatedDate,dec",
      label: t("job_journey.sorting.last_updated_date_dec"),
    },
    {
      value: "lastUpdatedDate,asc",
      label: t("job_journey.sorting.last_updated_date_asc"),
    },
    {
      value: "applicationDate,dec",
      label: t("job_journey.sorting.application_date_dec"),
    },
    {
      value: "applicationDate,asc",
      label: t("job_journey.sorting.application_date_asc"),
    },
    {
      value: "createdAt,dec",
      label: t("job_journey.sorting.created_at_dec"),
    },
    {
      value: "createdAt,asc",
      label: t("job_journey.sorting.created_at_asc"),
    },
  ]
  return options
}

export default useJobJourneySortOptions
