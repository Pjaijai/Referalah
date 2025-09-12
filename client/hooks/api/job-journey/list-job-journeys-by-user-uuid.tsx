"use client"

import { getJobJourneysByUserUuid } from "@/utils/common/api"
import { useQuery } from "@tanstack/react-query"

import { EQueryKeyString } from "@/types/common/query-key-string"

const useListJobJourneysByUserUuid = (
  userUuid: string,
  sortBy: string = "createdAt,desc"
) => {
  return useQuery({
    queryKey: [EQueryKeyString.JOB_JOURNEY_BY_USER_UUID, userUuid, sortBy],
    queryFn: () => getJobJourneysByUserUuid(userUuid, sortBy),
    enabled: !!userUuid,
  })
}

export default useListJobJourneysByUserUuid
