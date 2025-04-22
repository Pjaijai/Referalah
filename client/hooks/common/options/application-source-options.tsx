import { useMemo } from "react"
import { useI18n } from "@/utils/services/internationalization/client"

import { EApplicationSource } from "@/types/common/enums/application-source-type"
import { ISelectOption } from "@/components/customized-ui/selects/base"

const useApplicationSourceOptions = () => {
  const t = useI18n()

  const applicationSources = Object.values(EApplicationSource)
  return useMemo<ISelectOption[]>(() => {
    const options = applicationSources.map((source) => {
      const label = t(`job_journey.application_source.${source}`)

      return {
        value: source,
        label: `${label}`,
      }
    })

    return options
  }, [t])
}

export default useApplicationSourceOptions
