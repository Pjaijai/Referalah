"use client"

import { useMemo } from "react"
import { useI18n } from "@/utils/services/internationalization/client"

import { EJobType } from "@/types/common/enums/job-type"
import { ISelectOption } from "@/components/customized-ui/selects/base"

const useJobTypeOptions = () => {
  const t = useI18n()

  const jobTypes = Object.values(EJobType)

  return useMemo<ISelectOption[]>(() => {
    const options = jobTypes.map((type) => {
      const label = t(`job_journey.job_type.${type}`)

      return {
        value: type,
        label: `${label}`,
      }
    })

    return options
  }, [t])
}

export default useJobTypeOptions
