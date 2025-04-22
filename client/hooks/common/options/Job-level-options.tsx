import { useMemo } from "react"
import { useScopedI18n } from "@/utils/services/internationalization/client"

import { EJobLevel } from "@/types/common/enums/job-level"
import { ISelectOption } from "@/components/customized-ui/selects/base"

const useJobLevelOptions = () => {
  const t = useScopedI18n("job_journey.job_level")

  // Get all job levels from the EJobLevel enum, excluding "ALL"
  const jobLevels = Object.values(EJobLevel)
  return useMemo<ISelectOption[]>(() => {
    const options = jobLevels.map((level) => {
      // Fetch English and Cantonese translations using i18n
      const name = t(`${level}`)

      return {
        value: level, // Use the EJobLevel enum value (e.g., EJobLevel.C_LEVEL)
        label: `${name}`, // Use i18n to fetch both translations
      }
    })

    return options
  }, [t]) // Depend on `t` to re-memoize if the language changes
}

export default useJobLevelOptions
