import { useEffect, useState } from "react"
import { supabase } from "@/utils/services/supabase/config"

import { IIndustryResponse } from "@/types/api/reponse/industry"

const useGetIndustryList = () => {
  const [industry, setIndustry] = useState<IIndustryResponse[]>([])

  useEffect(() => {
    // Create an async function to fetch data
    async function fetchData() {
      // Fetch country data
      const { data: industryData, error: industryError } = await supabase
        .from("industry")
        .select("*")

      if (industryError) {
        console.error("Error fetching country data:", industryError)
      } else {
        // Update the countryData state with the fetched data
        setIndustry(industryData)
      }
    }

    // Call the fetchData function
    fetchData()
  }, [])

  return { industry }
}

export default useGetIndustryList
