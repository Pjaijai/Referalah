import { ChangeEvent, useCallback, useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { isTypeExitsInCurrentTypes } from "@/modules/post/utils/is-type-exits-in-current-types"
import { searchPostApi } from "@/utils/common/api"
import { useInfiniteQuery } from "@tanstack/react-query"

import { IPostFilterMeta } from "@/types/api/request/post/filter-meta"
import { ICityResponse } from "@/types/api/response/city"
import { ICountryResponse } from "@/types/api/response/country"
import { IIndustryResponse } from "@/types/api/response/industry"
import { IProvinceResponse } from "@/types/api/response/province"
import { EQueryKeyString } from "@/types/common/query-key-string"
import { EReferralType } from "@/types/common/referral-type"
import usePostSortOptions from "@/hooks/common/sort/post-sort-options"

const searchPost = ({
  pageParam = 0,
  queryKey,
}: {
  pageParam?: number
  queryKey: [
    EQueryKeyString,
    {
      sorting: string
      filterMeta: IPostFilterMeta
    },
  ]
}) => {
  const NUMBER_OF_DATE_PER_FETCH = 5

  const queryKeyItem = queryKey[1]

  const { filterMeta, sorting } = queryKeyItem

  const countryUuid = filterMeta.countryUuid
  const provinceUuid = filterMeta.provinceUuid
  const cityUuid = filterMeta.cityUuid
  const industryUuid = filterMeta.industryUuid
  const companyName = filterMeta.companyName
  const jobTitle = filterMeta.jobTitle
  const sortingType = sorting
  const maxYearOfExperience = filterMeta.maxYearOfExperience
  const minYearOfExperience = filterMeta.minYearOfExperience
  const postTypes = filterMeta.types

  return searchPostApi({
    companyName: companyName,
    numberOfDataPerPage: NUMBER_OF_DATE_PER_FETCH,
    cityUuid,
    countryUuid,
    industryUuid,
    jobTitle,
    provinceUuid,
    page: pageParam,
    types: postTypes,
    sortingType,
    maxYearOfExperience: maxYearOfExperience
      ? parseInt(maxYearOfExperience)
      : 100,
    minYearOfExperience: minYearOfExperience
      ? parseInt(minYearOfExperience)
      : 0,
  })
}

interface ISearchPostProps {
  countryList: ICountryResponse[]
  provinceList: IProvinceResponse[]
  cityList: ICityResponse[]
  industryList: IIndustryResponse[]
}

const useSearchPost = (props: ISearchPostProps) => {
  const {
    countryList: countryData,
    provinceList: provinceData,
    cityList: cityData,
    industryList: industryData,
  } = props

  const { data: postSortingOptions } = usePostSortOptions()

  const keyString = EQueryKeyString.SEARCH_POST

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
  const [minYearOfExperience, setMinYearOfExperience] = useState<
    undefined | string
  >(searchParams.get("minYearOfExperience")?.toString() || undefined)
  const [maxYearOfExperience, setMaxYearOfExperience] = useState<
    undefined | string
  >(searchParams.get("maxYearOfExperience")?.toString() || undefined)
  const [sorting, setSorting] = useState(
    searchParams.get("sorting")?.toString() || postSortingOptions[0].value
  )

  const initialPostTypes = searchParams
    .get("types")
    ?.split(",")
    .map((type) => {
      if (Object.values(EReferralType).includes(type as EReferralType)) {
        return type as EReferralType
      } else {
        // Handle invalid type value
        return undefined // or any other default value/error handling
      }
    })
    .filter((type) => type !== undefined) as EReferralType[]

  const defaultPostTypes = [
    EReferralType.HIRING,
    EReferralType.REFEREE,
    EReferralType.REFERRER,
  ]
  const [postTypes, setPostTypes] = useState<EReferralType[]>(
    initialPostTypes || defaultPostTypes
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

  const handlePostTypesChange = (type: EReferralType) => {
    if (
      isTypeExitsInCurrentTypes(postTypes, type) === true &&
      postTypes.length > 1
    ) {
      const newTypes = postTypes.filter((v) => v !== type)
      setPostTypes(newTypes)
      createQueryString("types", newTypes.join(","))
    } else if (isTypeExitsInCurrentTypes(postTypes, type) === false) {
      const newTypes = [...postTypes, type]
      setPostTypes(newTypes)
      createQueryString("types", newTypes.join(","))
    }
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
        countryData?.find((item) => item.uuid === value)?.value ?? value
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
        provinceData?.find((item) => item.uuid === value)?.value ?? value
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
        cityData?.find((item) => item.uuid === value)?.value ?? value
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
        industryData?.find((item) => item.uuid === value)?.value ?? value
      )
    }
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

  const handleReset = () => {
    setCompanyName("")
    setJobTitle("")
    setCountryUuid("all")
    setProvinceUuid(undefined)
    setCityUuid(undefined)
    setIndustryUuid(undefined)
    setMaxYearOfExperience(undefined)
    setMinYearOfExperience(undefined)
    setSorting(postSortingOptions[0].value)
    setParams(new URLSearchParams())
    setPostTypes(defaultPostTypes)
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
      searchParams.get("sorting")?.toString() || postSortingOptions[0].value,
    minYearOfExperience: searchParams.get("minYearOfExperience")?.toString(),
    maxYearOfExperience: searchParams.get("maxYearOfExperience")?.toString(),
    types: initialPostTypes || defaultPostTypes,
  }

  const result = useInfiniteQuery({
    queryKey: [keyString, { sorting: filterMeta.sorting, filterMeta }],
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
    handleMinYearOfExperienceChange,
    handleMaxYearOfExperienceChange,
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
    maxYearOfExperience,
    minYearOfExperience,
    sorting,
    handlePostTypesChange,
    postTypes,
  }
}

export default useSearchPost
