import { createJobJourney } from "@/utils/common/api"
import { useMutation } from "@tanstack/react-query"

import { TCreateJobJourneyRequest, TJobJourney } from "@/types/api/job-journey"

export const useCreateJobJourney = () => {
  return useMutation<TJobJourney, Error, TCreateJobJourneyRequest>({
    mutationFn: createJobJourney,
  })
}
