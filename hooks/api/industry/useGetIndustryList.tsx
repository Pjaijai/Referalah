import { useEffect, useMemo, useState } from "react"
import { supabase } from "@/utils/services/supabase/config"

const useGetIndustryList = () => {
  const [industry, setIndustry] = useState<any[]>([])

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
