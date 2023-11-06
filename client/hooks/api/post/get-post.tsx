import { getPostByUuid } from "@/utils/common/api"
import { useQuery } from "@tanstack/react-query"

import { QueryKeyString } from "@/types/common/query-key-string"

const getPost = ({ queryKey }: any) => {
  const uuid = queryKey[1].uuid
  return getPostByUuid(uuid)
}
const useGetPost = (uuid: string | null) => {
  return useQuery({
    queryKey: [QueryKeyString.POST_DETAILS, { uuid }],
    queryFn: getPost,
    enabled: !!uuid,
  })
}

export default useGetPost
