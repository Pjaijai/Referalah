import { supabase } from "@/utils/services/supabase/config"
import { useQuery } from "@tanstack/react-query"

const useGetUserCount = () => {
  const fetchPosts = async ({ pageParam = 0, queryKey }: any) => {
    const { error, data, count } = await supabase
      .from("user")
      .select("id", { count: "exact" })

    return count
  }

  return useQuery({
    queryKey: [`number-of-user`],
    queryFn: fetchPosts,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    getNextPageParam: (lastPage, allPages: any[]) => {
      if (lastPage && lastPage.length > 0) {
        return allPages.length
      } else {
        return null
      }
    },
  })
}

export default useGetUserCount
