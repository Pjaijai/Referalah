import { checkHasConversationUnseen } from "@/utils/common/api"
import { useQuery } from "@tanstack/react-query"

import { EQueryKeyString } from "@/types/common/query-key-string"

const useCheckHasConversationUnseen = (userUuid: string | null) => {
  return useQuery({
    queryKey: [EQueryKeyString.HAS_CONVERSATION_UNSEEN, { userUuid }],
    queryFn: () => checkHasConversationUnseen(),
    enabled: !!userUuid,
    refetchOnWindowFocus: false,
  })
}

export default useCheckHasConversationUnseen
