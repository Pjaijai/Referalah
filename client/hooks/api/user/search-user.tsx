import { ChangeEvent, useCallback, useEffect, useReducer } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { searchUser } from "@/utils/common/api"
import { useInfiniteQuery } from "@tanstack/react-query"

import { IUserFilterMeta } from "@/types/api/request/user/filter-meta"
import { ICityResponse } from "@/types/api/response/city"
import { IIndustryResponse } from "@/types/api/response/industry"
import { EQueryKeyString } from "@/types/common/query-key-string"
import { EUserType } from "@/types/common/user-type"
import useDebounce from "@/hooks/common/debounce"
import useReferralSortOptions from "@/hooks/common/sort/referral-sort-options"

const mapCityToUuid = (cities: string[], cityData: ICityResponse[]) => {
  return cities
    .map((v) => {
      const city = cityData.find((d) => d.value === v)
      return city ? city.uuid : null
    })
    .filter((uuid): uuid is string => Boolean(uuid))
}

const mapIndustryToUuid = (
  industries: string[],
  industryData: IIndustryResponse[]
) => {
  return industries
    .map((v) => {
      const city = industryData.find((d) => d.value === v)
      return city ? city.uuid : null
    })
    .filter((uuid): uuid is string => Boolean(uuid))
}

const search = ({
  pageParam = 0,
  queryKey,
}: {
  pageParam?: number
  queryKey: [
    EQueryKeyString,
    {
      sorting: string
      filterMeta: IUserFilterMeta
    },
  ]
}) => {
  const NUMBER_OF_DATE_PER_FETCH = 6
  const queryKeyItem = queryKey[1]
  const { filterMeta, sorting } = queryKeyItem
  const industries = filterMeta.industries
  const sortingType = sorting
  const locations = filterMeta.locations
  const experience = Number(filterMeta.experience)
  const userType = filterMeta.type
  const keywords = filterMeta.keywords

  return searchUser({
    keywords,
    numberOfDataPerPage: NUMBER_OF_DATE_PER_FETCH,
    experience,
    industries,
    locations,
    page: pageParam,
    type: userType,
    sortingType,
  })
}
interface ISearchUserProps {
  cityList: ICityResponse[]
  industryList: IIndustryResponse[]
}

interface State {
  keywords: string
  debouncedKeywords: string
  locations: Set<string>
  industries: Set<string>
  experience: number
  debouncedExperience: number
  sorting: string
  userType: EUserType
  params: URLSearchParams
}

type Action =
  | { type: "SET_KEYWORDS"; payload: string }
  | { type: "SET_DEBOUNCED_KEYWORDS"; payload: string }
  | { type: "SET_LOCATIONS"; payload: Set<string> }
  | { type: "SET_INDUSTRIES"; payload: Set<string> }
  | { type: "SET_EXPERIENCE"; payload: number }
  | { type: "SET_DEBOUNCED_EXPERIENCE"; payload: number }
  | { type: "SET_SORTING"; payload: string }
  | { type: "SET_USER_TYPE"; payload: EUserType }
  | { type: "SET_PARAMS"; payload: URLSearchParams }
  | { type: "RESET"; payload: State }

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_KEYWORDS":
      return { ...state, keywords: action.payload }
    case "SET_DEBOUNCED_KEYWORDS":
      return { ...state, debouncedKeywords: action.payload }
    case "SET_LOCATIONS":
      return { ...state, locations: action.payload }
    case "SET_INDUSTRIES":
      return { ...state, industries: action.payload }
    case "SET_EXPERIENCE":
      return { ...state, experience: action.payload }
    case "SET_DEBOUNCED_EXPERIENCE":
      return { ...state, debouncedExperience: action.payload }
    case "SET_SORTING":
      return { ...state, sorting: action.payload }
    case "SET_USER_TYPE":
      return { ...state, userType: action.payload }
    case "SET_PARAMS":
      return { ...state, params: action.payload }
    case "RESET":
      return action.payload
    default:
      return state
  }
}

const useSearchUser = (props: ISearchUserProps) => {
  const { cityList: cityData, industryList: industryData } = props
  const { data: referralSortingOptions } = useReferralSortOptions()

  const keyString = EQueryKeyString.SEARCH_USER

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const initialUserTypes = searchParams.get("types") as EUserType

  const initialState: State = {
    keywords: searchParams.get("keywords")?.toString() || "",
    debouncedKeywords: searchParams.get("keywords")?.toString() || "",
    locations: new Set(
      searchParams.get("locations")
        ? mapCityToUuid(
            searchParams.get("locations")!.toString().split(","),
            cityData
          )
        : cityData.map((data) => data.uuid)
    ),
    industries: new Set(
      searchParams.get("industries")
        ? mapIndustryToUuid(
            searchParams.get("industries")!.toString().split(","),
            industryData
          )
        : industryData.map((data) => data.uuid)
    ),
    experience: Number(searchParams.get("experience")?.toString()) || 0,
    debouncedExperience:
      Number(searchParams.get("experience")?.toString()) || 0,
    sorting:
      searchParams.get("sorting")?.toString() ||
      referralSortingOptions[0].value,
    userType: initialUserTypes || EUserType.ALL,
    params: new URLSearchParams(searchParams.toString()),
  }

  const [state, dispatch] = useReducer(reducer, initialState)

  const debouncedKeywords = useDebounce(state.keywords, 1000)
  const debouncedExperience = useDebounce(state.experience, 1000)

  useEffect(() => {
    dispatch({ type: "SET_DEBOUNCED_KEYWORDS", payload: debouncedKeywords })

    if (debouncedKeywords.trim()) {
      createQueryString("keywords", debouncedKeywords.trim())
    } else {
      removeQueryString("keywords")
    }
  }, [debouncedKeywords])

  useEffect(() => {
    dispatch({ type: "SET_DEBOUNCED_EXPERIENCE", payload: debouncedExperience })

    if (debouncedExperience > 0) {
      createQueryString("experience", String(debouncedExperience))
    } else {
      removeQueryString("experience")
    }
  }, [debouncedExperience])

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const newParams = new URLSearchParams(state.params.toString())
      newParams.set(name, value)
      dispatch({ type: "SET_PARAMS", payload: newParams })
      return newParams.toString()
    },
    [state.params]
  )

  const removeQueryString = useCallback(
    (name: string) => {
      const newParams = new URLSearchParams(state.params.toString())
      newParams.delete(name)
      dispatch({ type: "SET_PARAMS", payload: newParams })
      return newParams.toString()
    },
    [state.params]
  )

  useEffect(() => {
    router.push(`${pathname}?${state.params.toString()}`)
  }, [state.params, router, pathname])

  const handleKeywordsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const words = e.target.value
    dispatch({ type: "SET_KEYWORDS", payload: words })
  }

  const handleUserTypeChange = (type: EUserType) => {
    dispatch({ type: "SET_USER_TYPE", payload: type })
    if (type === EUserType.ALL) {
      removeQueryString("types")
    } else {
      createQueryString("types", type)
    }
  }

  const handleLocationChange = (value: string[]) => {
    dispatch({ type: "SET_LOCATIONS", payload: new Set(value) })
    const isAllSelected = cityData.every((val) => value.includes(val.uuid))
    if (isAllSelected) {
      removeQueryString("locations")
    } else {
      createQueryString(
        "locations",
        value
          .map((v) => cityData.find((d) => d.uuid === v)?.value)
          .filter(Boolean)
          .join(",")
      )
    }
  }

  const handleIndustryChange = (value: string[]) => {
    dispatch({ type: "SET_INDUSTRIES", payload: new Set(value) })
    const isAllSelected = industryData.every((val) => value.includes(val.uuid))
    if (isAllSelected) {
      removeQueryString("industries")
    } else {
      createQueryString(
        "industries",
        value
          .map((v) => industryData.find((d) => d.uuid === v)?.value)
          .filter(Boolean)
          .join(",")
      )
    }
  }

  const handleExperienceChange = (value: number) => {
    dispatch({ type: "SET_EXPERIENCE", payload: value })
  }

  const handleSortingChange = (value: string) => {
    dispatch({ type: "SET_SORTING", payload: value })
    createQueryString("sorting", value)
  }

  const handleReset = () => {
    const resetState = {
      ...initialState,
      sorting: referralSortingOptions[0].value,
      params: new URLSearchParams(),
      userType: EUserType.ALL,
      locations: new Set(cityData.map((data) => data.uuid)),
      industries: new Set(industryData.map((data) => data.uuid)),
      keywords: "",
      debouncedKeywords: "",
      experience: 0,
      debouncedExperience: 0,
    }
    dispatch({ type: "RESET", payload: resetState })
    router.push(pathname)
  }

  const filterMeta: IUserFilterMeta = {
    keywords: state.debouncedKeywords,
    locations: Array.from(state.locations),
    industries: Array.from(state.industries),
    sorting: state.sorting,
    experience: state.debouncedExperience,
    type: state.userType,
  }

  const result = useInfiniteQuery({
    queryKey: [keyString, { sorting: state.sorting, filterMeta }],
    queryFn: search,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 100,
    getNextPageParam: (lastPage, allPages) => {
      if (Array.isArray(lastPage) && lastPage.length > 0) {
        return allPages.length
      } else {
        return null
      }
    },
  })

  return {
    result,
    handleKeywordsChange,
    handleSortingChange,
    handleIndustryChange,
    handleReset,
    keywords: state.keywords,
    debouncedKeywords: state.debouncedKeywords,
    sorting: state.sorting,
    handleUserTypeChange,
    userType: state.userType,
    handleLocationChange,
    locations: state.locations,
    industries: state.industries,
    handleExperienceChange,
    experience: state.experience,
    debouncedExperience: state.debouncedExperience,
  }
}

export default useSearchUser
