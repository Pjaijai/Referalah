import { getFiresByUserUuid, getUserProfile } from "@/utils/common/api"
import { useQuery } from "@tanstack/react-query"

import { EQueryKeyString } from "@/types/common/query-key-string"

const useGetFiresByUserUuid = (userUuid: string | null) => {
  return useQuery({
    queryKey: [EQueryKeyString.USER_FIRES, { userUuid }],
    queryFn: () => getFiresByUserUuid({ uuid: userUuid! }),
    enabled: !!userUuid,
  })
}

export default useGetFiresByUserUuid
