import { useMemo } from "react"
import { useI18n } from "@/utils/services/internationalization/client"

import { EInterviewLocation } from "@/types/common/enums/interview-location"
import { ISelectOption } from "@/components/customized-ui/selects/base"

const useInterviewLocationOptions = () => {
  const t = useI18n()

  const interviewLocations = Object.values(EInterviewLocation)

  return useMemo<ISelectOption[]>(() => {
    const options = interviewLocations.map((location) => {
      const label = t(`job_journey.interview_location.${location}`)

      return {
        value: location,
        label: `${label}`,
      }
    })

    return options
  }, [t])
}

export default useInterviewLocationOptions
