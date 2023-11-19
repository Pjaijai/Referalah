import { ChangeEvent, useCallback, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { searchPostApi } from "@/utils/common/api"
import { postSortingOptions } from "@/utils/common/sorting/post"
import { useInfiniteQuery } from "@tanstack/react-query"

import { IFilterMeta } from "@/types/api/request/post/filter-meta"
import { EQueryKeyString } from "@/types/common/query-key-string"
import { EReferralType } from "@/types/common/referral-type"
import useIndustryOptions from "@/hooks/api/industry/get-Industry-list"
import useGetCountryList from "@/hooks/api/location/get-country-list"
import useGetProvinceList from "@/hooks/api/location/get-province-list"

const searchPost = ({
  pageParam = 0,
  queryKey,
}: {
  pageParam?: number
  queryKey: [
    EQueryKeyString,
    {
      sorting: string
      filterMeta: IFilterMeta
      type: EReferralType
    },
  ]
}) => {
  const NUMBER_OF_DATE_PER_FETCH = 5

  const queryKeyItem = queryKey[1]

  const { type, filterMeta, sorting } = queryKeyItem

  const countryUuid = filterMeta.countryUuid
  const provinceUuid = filterMeta.provinceUuid
  const cityUuid = filterMeta.cityUuid
  const industryUuid = filterMeta.industryUuid
  const companyName = filterMeta.companyName
  const jobTitle = filterMeta.jobTitle
  const sortingType = sorting
  const yoeMax = filterMeta.yoeMax
  const yoeMin = filterMeta.yoeMin

  return searchPostApi({
    companyName: companyName,
    numberOfDataPerPage: NUMBER_OF_DATE_PER_FETCH,
    cityUuid,
    countryUuid,
    industryUuid,
    jobTitle,
    provinceUuid,
    page: pageParam,
    type,
    sortingType,
    maxYearOfExperience: parseInt(yoeMax),
    minYearOfExperience: parseInt(yoeMin),
  })
}
const useSearchPost = (type: EReferralType) => {
  const countryData = useGetCountryList().data
  const provinceData = useGetProvinceList().data
  const industryData = useIndustryOptions().data

  const keyString =
    type === EReferralType.REFEREE
      ? EQueryKeyString.SEARCH_REFEREE_POST
      : EQueryKeyString.SEARCH_REFERRER_POST

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [companyName, setCompanyName] = useState(
    searchParams.get("company")?.toString() || ""
  )
  const [jobTitle, setJobTitle] = useState(
    searchParams.get("jobTitle")?.toString() || ""
  )
  const [provinceUuid, setProvinceUuid] = useState<undefined | string>(
    searchParams.get("province")?.toString()
  )
  const [countryUuid, setCountryUuid] = useState<undefined | string>(
    searchParams.get("country")?.toString()
  )
  const [cityUuid, setCityUuid] = useState<undefined | string>(
    searchParams.get("city")?.toString()
  )
  const [industryUuid, setIndustryUuid] = useState<undefined | string>(
    searchParams.get("industry")?.toString()
  )
  const [yoeMin, setYoeMin] = useState<undefined | string>(
    searchParams.get("yoeMin")?.toString() || "0"
  )
  const [yoeMax, setYoeMax] = useState<undefined | string>(
    searchParams.get("yoeMax")?.toString() || "100"
  )
  const [sorting, setSorting] = useState(
    searchParams.get("sorting")?.toString() || postSortingOptions[0].value
  )
  const [params] = useState(new URLSearchParams(searchParams.toString()))

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
    createQueryString("city", value)
  }

  const handleIndustryChange = (value: string) => {
    setIndustryUuid(value)
    createQueryString(
      "industry",
      industryData?.find((item) => item.uuid === value)?.value ?? value
    )
  }

  const handleSortingChange = (value: string) => {
    setSorting(value)
    createQueryString("sorting", value)
  }

  const handleYoeMinChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value

    // Parse the input value to an integer
    const integerValue = parseInt(rawValue)

    // Check if the parsed value is a valid integer
    if (!isNaN(integerValue) && integerValue >= 0) {
      // If it's a non-negative integer, set the value as is
      setYoeMin(integerValue.toString())
      createQueryString("yoeMin", integerValue.toString())
    } else {
      // If it's negative or not a valid integer, set it to '0'
      setYoeMin("0")
      createQueryString("yoeMin", "0")
    }
  }

  const handleYoeMaxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value

    // Parse the input value to an integer
    const integerValue = parseInt(rawValue)

    // Check if the parsed value is a valid integer
    if (!isNaN(integerValue) && integerValue >= 0) {
      // If it's a non-negative integer, set the value as is
      setYoeMax(integerValue.toString())
      createQueryString("yoeMax", integerValue.toString())
    } else {
      // If it's negative or not a valid integer, set it to '0'
      setYoeMax("0")
      createQueryString("yoeMax", "0")
    }
  }

  const handleReset = () => {
    setCompanyName("")
    setJobTitle("")
    setCountryUuid(undefined)
    setProvinceUuid(undefined)
    setCityUuid(undefined)
    setIndustryUuid(undefined)
    setYoeMax("100")
    setYoeMin("0")
    setSorting(postSortingOptions[0].value)
    router.push(pathname)
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

  const getUUid = (meta: string, value?: string) => {
    if (!value) return undefined
    if (meta === "country")
      return countryData?.find((item) => item.value === value)?.uuid
    if (meta === "province")
      return provinceData?.find((item) => item.value === value)?.uuid
    if (meta === "industry")
      return industryData?.find((item) => item.value === value)?.uuid
  }

  const filterMeta = {
    companyName: searchParams.get("company")?.toString() || "",
    jobTitle: searchParams.get("jobTitle")?.toString() || "",
    cityUuid: searchParams.get("city")?.toString() || undefined,
    countryUuid:
      getUUid("country", searchParams.get("country")?.toString()) || undefined,
    industryUuid:
      getUUid("industry", searchParams.get("industry")?.toString()) ||
      undefined,
    provinceUuid:
      getUUid("province", searchParams.get("province")?.toString()) ||
      undefined,
    sorting:
      searchParams.get("sorting")?.toString() || postSortingOptions[0].value,
    yoeMin: searchParams.get("yoeMin")?.toString() || "0",
    yoeMax: searchParams.get("yoeMax")?.toString() || "100",
  }

  const result = useInfiniteQuery({
    queryKey: [keyString, { sorting: filterMeta.sorting, filterMeta, type }],
    queryFn: searchPost,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
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
    handleYoeMinChange,
    handleYoeMaxChange,
    handleJobTitleChange,
    handleReset,
    handleSubmitChange,
    handleKeyPressSubmitChange,
    jobTitle,
    companyName,
    provinceUuid,
    cityUuid,
    countryUuid,
    industryUuid,
    yoeMax,
    yoeMin,
    sorting,
  }
}

export default useSearchPost
