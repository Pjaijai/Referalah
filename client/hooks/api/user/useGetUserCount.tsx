import { supabase } from "@/utils/services/supabase/config"
import { useQuery } from "@tanstack/react-query"

const useGetUserCount = () => {
  const fetchPosts = async ({ pageParam = 0, queryKey }: any) => {
    const { count } = await supabase
      .from("user")
      .select("id", { count: "exact" })

    return count
  }

  return useQuery({
    queryKey: [`number-of-user`],
    queryFn: fetchPosts,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  })
}

export default useGetUserCount
