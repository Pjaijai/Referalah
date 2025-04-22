"use client"

import { ChangeEvent, useCallback, useEffect, useReducer } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import findRelatedLocationsHelper from "@/modules/job-journey/helpers/find-related-locaitons"
import { searchJobJourney } from "@/utils/common/api"
import { useInfiniteQuery } from "@tanstack/react-query"

import { IJobJourneyFilterMeta } from "@/types/api/job-journey"
import { IIndustryResponse } from "@/types/api/response/industry"
import { TLocationData } from "@/types/api/response/location"
import { EJobLevel } from "@/types/common/enums/job-level"
import { EJobType } from "@/types/common/enums/job-type"
import { EQueryKeyString } from "@/types/common/query-key-string"
import useDebounce from "@/hooks/common/debounce"
import useJobJourneySortOptions from "@/hooks/common/sort/job-journey-sort-options"

const search = ({
  pageParam = 0,
  queryKey,
}: {
  pageParam?: number
  queryKey: [
    EQueryKeyString,
    {
      sorting: string
      filterMeta: IJobJourneyFilterMeta
    },
  ]
}) => {
  const NUMBER_OF_ITEMS_PER_FETCH = 5
  const queryKeyItem = queryKey[1]
  const { filterMeta, sorting } = queryKeyItem
  const locations = filterMeta.locations
  const jobLevel = filterMeta.jobLevel
  const jobType = filterMeta.jobType
  const industry = filterMeta.industry
  const keywords = filterMeta.keywords

  return searchJobJourney({
    keywords,
    numberOfItemsPerPage: NUMBER_OF_ITEMS_PER_FETCH,
    locations,
    jobLevel,
    jobType,
    industry,
    page: pageParam,
    sortingType: sorting,
  })
}

interface ISearchJourneyProps {
  locationList: TLocationData[]
  industryList: IIndustryResponse[]
}

interface State {
  keywords: string
  debouncedKeywords: string
  locations: string[]
  location: string
  jobLevel: EJobLevel | "all"
  jobType: EJobType | "all"
  industry: string
  sorting: string
  params: URLSearchParams
}

type Action =
  | { type: "SET_KEYWORDS"; payload: string }
  | { type: "SET_DEBOUNCED_KEYWORDS"; payload: string }
  | { type: "SET_LOCATION"; payload: string }
  | { type: "SET_LOCATIONS"; payload: string[] }
  | { type: "SET_JOB_LEVEL"; payload: EJobLevel | "all" }
  | { type: "SET_JOB_TYPE"; payload: EJobType | "all" }
  | { type: "SET_INDUSTRY"; payload: string }
  | { type: "SET_SORTING"; payload: string }
  | { type: "SET_PARAMS"; payload: URLSearchParams }
  | { type: "RESET"; payload: State }

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_KEYWORDS":
      return { ...state, keywords: action.payload }
    case "SET_LOCATION":
      return { ...state, location: action.payload }
    case "SET_DEBOUNCED_KEYWORDS":
      return { ...state, debouncedKeywords: action.payload }
    case "SET_LOCATIONS":
      return { ...state, locations: action.payload }
    case "SET_JOB_LEVEL":
      return { ...state, jobLevel: action.payload }
    case "SET_JOB_TYPE":
      return { ...state, jobType: action.payload }
    case "SET_INDUSTRY":
      return { ...state, industry: action.payload }
    case "SET_SORTING":
      return { ...state, sorting: action.payload }
    case "SET_PARAMS":
      return { ...state, params: action.payload }
    case "RESET":
      return action.payload
    default:
      return state
  }
}

const useSearchJourney = (props: ISearchJourneyProps) => {
  const { locationList: locationData, industryList: industryData } = props

  const journeySortOptions = useJobJourneySortOptions()

  const keyString = EQueryKeyString.SEARCH_JOB_JOURNEY

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const initialJobLevel = searchParams.get("jobLevel") as EJobLevel
  const initialJobType = searchParams.get("jobType") as EJobType

  const initialState: State = {
    keywords: searchParams.get("keywords")?.toString() || "",
    debouncedKeywords: searchParams.get("keywords")?.toString() || "",
    locations: findRelatedLocationsHelper(
      locationData,
      searchParams.get("location")?.toString()
    ),
    location: searchParams?.get("location") || "all",
    jobLevel: initialJobLevel || "all",
    jobType: initialJobType || "all",
    industry:
      (searchParams.get("industries") &&
        industryData.find(
          (data) => data.value === searchParams.get("industry")?.toString()
        )?.uuid) ||
      "all",
    sorting:
      searchParams.get("sorting")?.toString() || journeySortOptions[0].value,
    params: new URLSearchParams(searchParams.toString()),
  }

  const [state, dispatch] = useReducer(reducer, initialState)
  console.log(111111, state.locations)
  const debouncedKeywords = useDebounce(state.keywords, 1000)

  useEffect(() => {
    dispatch({ type: "SET_DEBOUNCED_KEYWORDS", payload: debouncedKeywords })

    if (debouncedKeywords.trim()) {
      createQueryString("keywords", debouncedKeywords.trim())
    } else {
      removeQueryString("keywords")
    }
  }, [debouncedKeywords])

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

  const handleJobLevelChange = (level: EJobLevel | "all") => {
    dispatch({ type: "SET_JOB_LEVEL", payload: level })
    if (level === "all") {
      removeQueryString("jobLevel")
    } else {
      createQueryString("jobLevel", level)
    }
  }

  const handleJobTypeChange = (type: EJobType | "all") => {
    dispatch({ type: "SET_JOB_TYPE", payload: type })
    if (type === "all") {
      removeQueryString("jobType")
    } else {
      createQueryString("jobType", type)
    }
  }

  const handleLocationChange = (uuid: string | "all") => {
    if (uuid === "all") {
      removeQueryString("location")
      dispatch({ type: "SET_LOCATION", payload: "all" })
      dispatch({ type: "SET_LOCATIONS", payload: [] })
    } else {
      const LocationValue = locationData.find((d) => d.uuid === uuid)?.value
      if (!LocationValue) return

      dispatch({ type: "SET_LOCATION", payload: LocationValue })
      dispatch({
        type: "SET_LOCATIONS",
        payload: findRelatedLocationsHelper(locationData, LocationValue),
      })

      createQueryString("location", LocationValue)
    }
  }

  const handleIndustryChange = (value: string) => {
    dispatch({ type: "SET_INDUSTRY", payload: value })
    if (value === "all") {
      removeQueryString("industry")
    } else {
      createQueryString(
        "industry",
        industryData.find((d) => d.uuid === value)?.value as string | "all"
      )
    }
  }

  const handleSortingChange = (value: string) => {
    dispatch({ type: "SET_SORTING", payload: value })
    createQueryString("sorting", value)
  }

  const handleReset = () => {
    const resetState = {
      ...initialState,
      sorting: journeySortOptions[0].value,
      params: new URLSearchParams(),
      jobLevel: "all" as const,
      jobType: "all" as const,
      locations: [],
      location: "all" as const,
      industries: null,
      keywords: "",
      debouncedKeywords: "",
    }
    dispatch({ type: "RESET", payload: resetState })
    router.push(pathname)
  }

  const filterMeta: IJobJourneyFilterMeta = {
    keywords: state.debouncedKeywords,
    jobLevel: state.jobLevel,
    jobType: state.jobType,
    industry: state.industry,
    sorting: state.sorting,
    locations: state.locations,
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
        return undefined
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
    sorting: state.sorting,
    handleJobTypeChange,
    handleJobLevelChange,
    jobLevel: state.jobLevel,
    jobType: state.jobType,
    handleLocationChange,
    location: state.location,
    industry: state.industry,
  }
}

export default useSearchJourney
