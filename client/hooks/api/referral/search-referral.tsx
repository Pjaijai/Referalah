import { ChangeEvent, useCallback, useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { searchReferral } from "@/utils/common/api"
import { referralSortingOptions } from "@/utils/common/sorting/referer"
import { useInfiniteQuery } from "@tanstack/react-query"

import { EQueryKeyString } from "@/types/common/query-key-string"
import { EReferralType } from "@/types/common/referral-type"
import useIndustryOptions from "@/hooks/api/industry/get-Industry-list"
import useGetCityList from "@/hooks/api/location/get-city-list"
import useGetCountryList from "@/hooks/api/location/get-country-list"
import useGetProvinceList from "@/hooks/api/location/get-province-list"

const useSearchReferral = (type: EReferralType) => {
  const { data: countryData, isLoading: isCountryDataLoading } =
    useGetCountryList()
  const { data: provinceData, isLoading: isProvinceDataLoading } =
    useGetProvinceList()
  const { data: cityData, isLoading: isCityDataLoading } = useGetCityList()
  const { data: industryData, isLoading: isIndustryDataLoading } =
    useIndustryOptions()

  const keyString =
    type === EReferralType.REFEREE
      ? EQueryKeyString.SEARCH_REFEREE
      : EQueryKeyString.SEARCH_REFERRER

  const getUUid = useCallback(
    (meta: "country" | "industry" | "province" | "city", value?: string) => {
      if (!value) return undefined
      if (meta === "country")
        return countryData?.find((item) => item.value === value)?.uuid
      if (meta === "province")
        return provinceData?.find((item) => item.value === value)?.uuid
      if (meta === "city")
        return cityData?.find((item) => item.value === value)?.uuid
      if (meta === "industry")
        return industryData?.find((item) => item.value === value)?.uuid
    },
    [cityData, countryData, industryData, provinceData]
  )

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [companyName, setCompanyName] = useState(
    searchParams.get("company")?.toString() || ""
  )
  const [jobTitle, setJobTitle] = useState(
    searchParams.get("jobTitle")?.toString() || ""
  )
  const [provinceUuid, setProvinceUuid] = useState<undefined | string>()
  const [countryUuid, setCountryUuid] = useState<undefined | string>()
  const [cityUuid, setCityUuid] = useState<undefined | string>()
  const [industryUuid, setIndustryUuid] = useState<undefined | string>()
  const [yearOfExperienceMin, setYearOfExperienceMin] = useState<
    undefined | string
  >(searchParams.get("yearOfExperienceMin")?.toString() || "0")
  const [yearOfExperienceMax, setYearOfExperienceMax] = useState<
    undefined | string
  >(searchParams.get("yearOfExperienceMax")?.toString() || "100")
  const [sorting, setSorting] = useState(
    searchParams.get("sorting")?.toString() || referralSortingOptions[0].value
  )
  const [params, setParams] = useState(
    new URLSearchParams(searchParams.toString())
  )

  const createQueryString = useCallback(
    (name: string, value: string) => {
      params.set(name, value)

      return params.toString()
    },
    [params]
  )

  const handleCompanyChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCompanyName(e.target.value)
    createQueryString("company", e.target.value)
  }

  const handleJobTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setJobTitle(e.target.value)
    createQueryString("jobTitle", e.target.value)
  }

  const handleCountryChange = (value: string) => {
    setCountryUuid(value)
    createQueryString(
      "country",
      countryData?.find((item) => item.uuid === value)?.value ?? value
    )
  }
  const handleProvinceChange = (value: string) => {
    setProvinceUuid(value)
    createQueryString(
      "province",
      provinceData?.find((item) => item.uuid === value)?.value ?? value
    )
  }
  const handleCityChange = (value: string) => {
    setCityUuid(value)

    createQueryString(
      "city",
      cityData?.find((item) => item.uuid === value)?.value ?? value
    )
  }

  const handleIndustryChange = (value: string) => {
    setIndustryUuid(value)
    createQueryString(
      "industry",
      industryData?.find((item) => item.uuid === value)?.value ?? value
    )
  }

  const handleReset = () => {
    setCompanyName("")
    setJobTitle("")
    setCountryUuid(undefined)
    setProvinceUuid(undefined)
    setCityUuid(undefined)
    setIndustryUuid(undefined)
    setYearOfExperienceMax("100")
    setYearOfExperienceMin("0")
    setSorting(referralSortingOptions[0].value)
    setParams(new URLSearchParams())
    router.push(pathname)
  }
  const handleSortingChange = (value: string) => {
    setSorting(value)
    createQueryString("sorting", value)
  }

  const handleYearOfExperienceMinChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const rawValue = e.target.value

    // Parse the input value to an integer
    const integerValue = parseInt(rawValue)

    // Check if the parsed value is a valid integer
    if (!isNaN(integerValue) && integerValue >= 0) {
      // If it's a non-negative integer, set the value as is
      setYearOfExperienceMin(integerValue.toString())
      createQueryString("yearOfExperienceMin", integerValue.toString())
    } else {
      // If it's negative or not a valid integer, set it to '0'
      setYearOfExperienceMin("0")
      createQueryString("yearOfExperienceMin", "0")
    }
  }

  const handleYearOfExperienceMaxChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const rawValue = e.target.value

    // Parse the input value to an integer
    const integerValue = parseInt(rawValue)

    // Check if the parsed value is a valid integer
    if (!isNaN(integerValue) && integerValue >= 0) {
      // If it's a non-negative integer, set the value as is
      setYearOfExperienceMax(integerValue.toString())
      createQueryString("yearOfExperienceMax", integerValue.toString())
    } else {
      // If it's negative or not a valid integer, set it to '0'
      setYearOfExperienceMax("0")
      createQueryString("yearOfExperienceMax", "0")
    }
  }

  const handleSubmitChange = () => {
    router.push(pathname + "?" + params.toString())
  }

  const handleKeyPressSubmitChange = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      handleSubmitChange()
    }
  }

  // To set the initial data back to uuid
  useEffect(() => {
    setCountryUuid(getUUid("country", searchParams.get("country")?.toString()))
    setProvinceUuid(
      getUUid("province", searchParams.get("province")?.toString())
    )
    setCityUuid(getUUid("city", searchParams.get("city")?.toString()))
    setIndustryUuid(
      getUUid("industry", searchParams.get("industry")?.toString())
    )
  }, [
    isProvinceDataLoading,
    isCountryDataLoading,
    isCityDataLoading,
    isIndustryDataLoading,
    getUUid,
    searchParams,
  ])

  const filterMeta = {
    companyName: searchParams.get("company")?.toString() || "",
    jobTitle: searchParams.get("jobTitle")?.toString() || "",
    cityUuid:
      getUUid("city", searchParams.get("city")?.toString()) || undefined,
    countryUuid:
      getUUid("country", searchParams.get("country")?.toString()) || undefined,
    industryUuid:
      getUUid("industry", searchParams.get("industry")?.toString()) ||
      undefined,
    provinceUuid:
      getUUid("province", searchParams.get("province")?.toString()) ||
      undefined,
    sorting:
      searchParams.get("sorting")?.toString() ||
      referralSortingOptions[0].value,
    yearOfExperienceMin:
      searchParams.get("yearOfExperienceMin")?.toString() || "0",
    yearOfExperienceMax:
      searchParams.get("yearOfExperienceMax")?.toString() || "100",
  }
  const result = useInfiniteQuery({
    queryKey: [keyString, { sorting: filterMeta.sorting, filterMeta, type }],
    queryFn: searchReferral,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled:
      !isCountryDataLoading &&
      !isProvinceDataLoading &&
      !isCityDataLoading &&
      !isIndustryDataLoading,
    getNextPageParam: (lastPage, allPages) => {
      if (Array.isArray(lastPage)) {
        return allPages.length
      } else {
        return null
      }
    },
  })

  return {
    result,
    handleCompanyChange,
    handleCountryChange,
    handleProvinceChange,
    handleCityChange,
    handleSortingChange,
    handleIndustryChange,
    handleYearOfExperienceMinChange,
    handleYearOfExperienceMaxChange,
    handleJobTitleChange,
    handleSubmitChange,
    handleKeyPressSubmitChange,
    jobTitle,
    companyName,
    provinceUuid,
    cityUuid,
    countryUuid,
    industryUuid,
    yearOfExperienceMax,
    yearOfExperienceMin,
    sorting,
    handleReset,
  }
}

export default useSearchReferral
