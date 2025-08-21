import { updateJobJourney } from "@/utils/common/api"
import { useMutation } from "@tanstack/react-query"

import { TJobJourney, TUpdateJobJourneyRequest } from "@/types/api/job-journey"

export const useUpdateJobJourney = (uuid: string) => {
  return useMutation<TJobJourney, Error, TUpdateJobJourneyRequest>({
    mutationFn: (data) => updateJobJourney(uuid, data),
  })
}
