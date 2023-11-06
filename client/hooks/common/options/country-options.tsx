import { useMemo } from "react"

import useGetCountryList from "@/hooks/api/location/get-country-list"
import { ISelectOption } from "@/components/customized-ui/selects/base"

const useCountryOptions = () => {
  const { data } = useGetCountryList()

  return useMemo<ISelectOption[]>(
    () =>
      Array.isArray(data)
        ? data.map((country) => ({
            value: country.uuid,
            title: `${country.english_name} | ${country.cantonese_name}`,
          }))
        : [],
    [data]
  )
}

export default useCountryOptions
