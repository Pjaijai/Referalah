import { ChangeEvent, useState } from "react"
import apiService from "@/utils/common/api"
import { postSortingOptions } from "@/utils/common/sorting/post"
import { UseInfiniteQueryResult, useInfiniteQuery } from "@tanstack/react-query"

import { ISearchPostResponse } from "@/types/api/response/referer-post"
import { QueryKeyString } from "@/types/common/query-key-string"
import { ReferralType } from "@/types/common/referral-type"
import useDebounce from "@/hooks/common/debounce"

const useSearchPost = (type: ReferralType) => {
  const keyString =
    type === ReferralType.REFEREE
      ? QueryKeyString.SEARCH_REFEREE_POST
      : QueryKeyString.SEARCH_REFERRER_POST

  const [companyName, setCompanyName] = useState("")
  const [jobTitle, setJobTitle] = useState("")
  const [provinceUuid, setProvinceUuid] = useState<undefined | string>()
  const [countryUuid, setCountryUuid] = useState<undefined | string>()
  const [cityUuid, setCityUuid] = useState<undefined | string>()
  const [industryUuid, setIndustryUuid] = useState<undefined | string>()
  const [yoeMin, setYoeMin] = useState<undefined | string>("0")
  const [yoeMax, setYoeMax] = useState<undefined | string>("100")
  const [sorting, setSorting] = useState(postSortingOptions[0].value)

  const debouncedCompanyName = useDebounce(companyName, 800)
  const debouncedJobTitle = useDebounce(jobTitle, 800)

  const handleCompanyChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCompanyName(e.target.value)
  }

  const handleJobTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setJobTitle(e.target.value)
  }

  const handleCountryChange = (value: string) => {
    setCountryUuid(value)
  }
  const handleProvinceChange = (value: string) => {
    setProvinceUuid(value)
  }
  const handleCityChange = (value: string) => {
    setCityUuid(value)
  }

  const handleIndustryChange = (value: string) => {
    setIndustryUuid(value)
  }

  const handleSortingChange = (value: string) => {
    setSorting(value)
  }

  const handleYoeMinChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value

    // Parse the input value to an integer
    const integerValue = parseInt(rawValue)

    // Check if the parsed value is a valid integer
    if (!isNaN(integerValue) && integerValue >= 0) {
      // If it's a non-negative integer, set the value as is
      setYoeMin(integerValue.toString())
    } else {
      // If it's negative or not a valid integer, set it to '0'
      setYoeMin("0")
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
    } else {
      // If it's negative or not a valid integer, set it to '0'
      setYoeMax("0")
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
  }

  const filterMeta = {
    companyName: debouncedCompanyName,
    jobTitle: debouncedJobTitle,
    cityUuid,
    countryUuid,
    industryUuid,
    provinceUuid,
    sorting,
    yoeMin,
    yoeMax,
  }

  const result: UseInfiniteQueryResult<ISearchPostResponse[]> =
    useInfiniteQuery({
      queryKey: [keyString, { sorting, filterMeta, type }],
      queryFn: apiService.searchPost,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      getNextPageParam: (lastPage, allPages: any[]) => {
        if (lastPage && lastPage.length > 0) {
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
