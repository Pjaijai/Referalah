import { ChangeEvent, useCallback, useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { searchReferral } from "@/utils/common/api"
import { useInfiniteQuery } from "@tanstack/react-query"

import { ICityResponse } from "@/types/api/response/city"
import { ICountryResponse } from "@/types/api/response/country"
import { IIndustryResponse } from "@/types/api/response/industry"
import { IProvinceResponse } from "@/types/api/response/province"
import { EQueryKeyString } from "@/types/common/query-key-string"
import { EReferralType } from "@/types/common/referral-type"
import useReferralSortOptions from "@/hooks/common/sort/referral-sort-options"

interface ISearchReferralProps {
  type: EReferralType
  countryList: ICountryResponse[]
  provinceList: IProvinceResponse[]
  cityList: ICityResponse[]
  industryList: IIndustryResponse[]
}

const useSearchReferral = (props: ISearchReferralProps) => {
  const { type, countryList, provinceList, cityList, industryList } = props
  const { data: referralSortingOptions } = useReferralSortOptions()

  const keyString =
    type === EReferralType.REFEREE
      ? EQueryKeyString.SEARCH_REFEREE
      : EQueryKeyString.SEARCH_REFERRER

  const getUUid = useCallback(
    (meta: "country" | "industry" | "province" | "city", value?: string) => {
      if (!value) return undefined
      if (meta === "country")
        return countryList.find((item) => item.value === value)?.uuid
      if (meta === "province")
        return provinceList?.find((item) => item.value === value)?.uuid
      if (meta === "city")
        return cityList?.find((item) => item.value === value)?.uuid
      if (meta === "industry")
        return industryList?.find((item) => item.value === value)?.uuid
    },
    [industryList, countryList, provinceList, cityList]
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
  const [minYearOfExperience, setMinYearOfExperience] = useState<
    undefined | string
  >(searchParams.get("minYearOfExperience")?.toString())
  const [maxYearOfExperience, setMaxYearOfExperience] = useState<
    undefined | string
  >(searchParams.get("maxYearOfExperience")?.toString())
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

  const removeQueryString = useCallback(
    (name: string) => {
      params.delete(name)

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
    if (value === "all") {
      setCountryUuid(undefined)
      setProvinceUuid(undefined)
      setCityUuid(undefined)
      removeQueryString("country")
      removeQueryString("province")
      removeQueryString("city")
    } else {
      setCountryUuid(value)
      setProvinceUuid(undefined)
      setCityUuid(undefined)
      createQueryString(
        "country",
        countryList?.find((item) => item.uuid === value)?.value ?? value
      )
    }
  }
  const handleProvinceChange = (value: string) => {
    if (value === "all") {
      setProvinceUuid(undefined)
      setCityUuid(undefined)
      removeQueryString("province")
      removeQueryString("city")
    } else {
      setProvinceUuid(value)
      setCityUuid(undefined)
      createQueryString(
        "province",
        provinceList?.find((item) => item.uuid === value)?.value ?? value
      )
    }
  }
  const handleCityChange = (value: string) => {
    if (value === "all") {
      setCityUuid(undefined)
      removeQueryString("city")
    } else {
      setCityUuid(value)
      createQueryString(
        "city",
        cityList?.find((item) => item.uuid === value)?.value ?? value
      )
    }
  }

  const handleIndustryChange = (value: string) => {
    if (value === "all") {
      setIndustryUuid(undefined)
      removeQueryString("industry")
    } else {
      setIndustryUuid(value)
      createQueryString(
        "industry",
        industryList?.find((item) => item.uuid === value)?.value ?? value
      )
    }
  }
  const handleReset = () => {
    setCompanyName("")
    setJobTitle("")
    setCountryUuid("all")
    setProvinceUuid(undefined)
    setCityUuid(undefined)
    setIndustryUuid(undefined)
    setMaxYearOfExperience(undefined)
    setMinYearOfExperience(undefined)
    setSorting(referralSortingOptions[0].value)
    setParams(new URLSearchParams())
    router.push(pathname)
  }
  const handleSortingChange = (value: string) => {
    setSorting(value)
    createQueryString("sorting", value)
  }

  const handleMinYearOfExperienceChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const rawValue = e.target.value

    // Parse the input value to an integer
    const integerValue = parseInt(rawValue)

    // Check if the parsed value is a valid integer
    if (!isNaN(integerValue) && integerValue >= 0) {
      // If it's a non-negative integer, set the value as is
      setMinYearOfExperience(integerValue.toString())
      createQueryString("minYearOfExperience", integerValue.toString())
    } else {
      // If it's negative or not a valid integer, set it to '0'
      setMinYearOfExperience("0")
      createQueryString("minYearOfExperience", "0")
    }
  }

  const handleMaxYearOfExperienceChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const rawValue = e.target.value

    // Parse the input value to an integer
    const integerValue = parseInt(rawValue)

    // Check if the parsed value is a valid integer
    if (!isNaN(integerValue) && integerValue >= 0) {
      // If it's a non-negative integer, set the value as is
      setMaxYearOfExperience(integerValue.toString())
      createQueryString("maxYearOfExperience", integerValue.toString())
    } else {
      // If it's negative or not a valid integer, set it to '0'
      setMaxYearOfExperience("0")
      createQueryString("maxYearOfExperience", "0")
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
  }, [getUUid, searchParams])

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
    minYearOfExperience:
      searchParams.get("minYearOfExperience")?.toString() || undefined,
    maxYearOfExperience:
      searchParams.get("maxYearOfExperience")?.toString() || undefined,
  }
  const result = useInfiniteQuery({
    queryKey: [keyString, { sorting: filterMeta.sorting, filterMeta, type }],
    queryFn: searchReferral,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
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
    handleMinYearOfExperienceChange,
    handleMaxYearOfExperienceChange,
    handleJobTitleChange,
    handleSubmitChange,
    handleKeyPressSubmitChange,
    jobTitle,
    companyName,
    provinceUuid,
    cityUuid,
    countryUuid,
    industryUuid,
    maxYearOfExperience,
    minYearOfExperience,
    sorting,
    handleReset,
  }
}

export default useSearchReferral
