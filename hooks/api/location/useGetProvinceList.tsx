import { useEffect, useState } from "react"
import { supabase } from "@/utils/services/supabase/config"

import { IProvinceResponse } from "@/types/api/reponse/province"

const useGetProvinceList = () => {
  const [province, setProvince] = useState<IProvinceResponse[]>([])

  useEffect(() => {
    // Create an async function to fetch data
    async function fetchData() {
      // Fetch country data
      const { data: provinceData, error: provinceError } = await supabase
        .from("province")
        .select("*")

      if (provinceError) {
        console.error("Error fetching country data:", provinceError)
      } else {
        // Update the countryData state with the fetched data
        setProvince(provinceData)
      }
    }

    // Call the fetchData function
    fetchData()
  }, [])

  return { province }
}

export default useGetProvinceList
