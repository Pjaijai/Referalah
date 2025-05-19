import { useMemo } from "react"
import { useI18n } from "@/utils/services/internationalization/client"

import { EStepType } from "@/types/common/enums/step-type"
import { ISelectOption } from "@/components/customized-ui/selects/base"

const useStepTypeOptions = () => {
  const t = useI18n()

  const stepTypes = Object.values(EStepType)

  return useMemo<ISelectOption[]>(() => {
    const options = stepTypes.map((type) => {
      const label = t(`job_journey.step_type.${type}`)

      return {
        value: type,
        label: `${label}`,
      }
    })

    return options
  }, [t])
}

export default useStepTypeOptions
