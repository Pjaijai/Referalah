import { useMemo } from "react"
import { useI18n } from "@/utils/services/internationalization/client"

import { EInterviewType } from "@/types/common/enums/interview-type"
import { ISelectOption } from "@/components/customized-ui/selects/base"

const useInterviewTypeOptions = () => {
  const t = useI18n()

  const interviewTypes = Object.values(EInterviewType)
  return useMemo<ISelectOption[]>(() => {
    const options = interviewTypes.map((type) => {
      const label = t(`job_journey.interview_type.${type}`)

      return {
        value: type,
        label: `${label}`,
      }
    })

    return options
  }, [t])
}

export default useInterviewTypeOptions
