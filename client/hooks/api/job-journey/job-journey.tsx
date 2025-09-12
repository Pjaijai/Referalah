import { createJobJourney, updateJobJourney } from "@/utils/common/api"
import { useMutation } from "@tanstack/react-query"

import {
  TCreateJobJourneyRequest,
  TJobJourney,
  TUpdateJobJourneyRequest,
} from "@/types/api/job-journey"

export const useCreateJobJourney = () => {
  return useMutation<TJobJourney, Error, TCreateJobJourneyRequest>({
    mutationFn: createJobJourney,
  })
}
export const useUpdateJobJourney = (uuid: string) => {
  return useMutation<TJobJourney, Error, TUpdateJobJourneyRequest>({
    mutationFn: (data) => updateJobJourney(uuid, data),
  })
}
