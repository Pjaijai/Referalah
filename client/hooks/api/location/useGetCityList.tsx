import { useEffect, useState } from "react"
import { supabase } from "@/utils/services/supabase/config"

import { ICityResponse } from "@/types/api/response/city"

const useGetCityList = () => {
  const [city, setCity] = useState<ICityResponse[]>([])

  useEffect(() => {
    // Create an async function to fetch data
    async function fetchData() {
      // Fetch country data
      const { data: cityData, error: cityError } = await supabase
        .from("city")
        .select("*")

      if (cityError) {
        console.error("Error fetching country data:", cityError)
      } else {
        // Update the countryData state with the fetched data
        setCity(cityData)
      }
    }

    // Call the fetchData function
    fetchData()
  }, [])

  return { city }
}

export default useGetCityList
