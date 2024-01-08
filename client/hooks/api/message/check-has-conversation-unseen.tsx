import { checkHasConversationUnseen } from "@/utils/common/api"
import { useQuery } from "@tanstack/react-query"

import { EQueryKeyString } from "@/types/common/query-key-string"

const checkUnseenConversion = () => {
  return checkHasConversationUnseen()
}

const useCheckHasConversationUnseen = (userUuid: string | null) => {
  return useQuery({
    queryKey: [EQueryKeyString.HAS_CONVERSATION_UNSEEN, { userUuid }],
    queryFn: checkUnseenConversion,
    enabled: !!userUuid,
    refetchOnWindowFocus: true,
  })
}

export default useCheckHasConversationUnseen
