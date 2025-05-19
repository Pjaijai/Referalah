"use client"

import "react"
import { searchCompanyByName } from "@/utils/common/api"
import { useQuery } from "@tanstack/react-query"

const QUERY_KEY = "searchCompanyByName"

interface UseSearchCompanyByNameProps {
  searchTerm: string
}

const useSearchCompanyByName = ({
  searchTerm,
}: UseSearchCompanyByNameProps) => {
  const trimmedSearchTerm = searchTerm.trim()
  return useQuery({
    queryKey: [QUERY_KEY, trimmedSearchTerm],
    queryFn: () => searchCompanyByName({ searchTerm: trimmedSearchTerm }),
    enabled: searchTerm.length > 0,
    staleTime: 1000 * 60 * 5,
  })
}

export default useSearchCompanyByName
