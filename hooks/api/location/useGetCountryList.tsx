import { useEffect, useState } from "react"
import { supabase } from "@/utils/services/supabase/config"

import { ICountryResponse } from "@/types/api/response/country"

const useGetCountryList = () => {
  const [country, setCountry] = useState<ICountryResponse[]>([])

  useEffect(() => {
    // Create an async function to fetch data
    async function fetchData() {
      // Fetch country data
      const { data: countryData, error: countryError } = await supabase
        .from("country")
        .select("*")

      if (countryError) {
        console.error("Error fetching country data:", countryError)
      } else {
        // Update the countryData state with the fetched data
        setCountry(countryData)
      }
    }

    // Call the fetchData function
    fetchData()
  }, [])

  return { country }
}

export default useGetCountryList
