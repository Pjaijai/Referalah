"use client"

import { ChangeEvent, useCallback, useEffect, useReducer } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import findRelatedLocationsHelper from "@/modules/job-journey/helpers/find-related-location"
import { searchPost } from "@/utils/common/api"
import { useInfiniteQuery } from "@tanstack/react-query"

import { IPostFilterMeta } from "@/types/api/request/post/filter-meta"
import { IIndustryResponse } from "@/types/api/response/industry"
import { TLocationData } from "@/types/api/response/location"
import { EPostType } from "@/types/common/post-type"
import { EQueryKeyString } from "@/types/common/query-key-string"
import useDebounce from "@/hooks/common/debounce"
import usePostSortOptions from "@/hooks/common/sort/post-sort-options"

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
      filterMeta: IPostFilterMeta
    },
  ]
}) => {
  const NUMBER_OF_DATE_PER_FETCH = 5
  const queryKeyItem = queryKey[1]
  const { filterMeta, sorting } = queryKeyItem
  const industries = filterMeta.industries
  const sortingType = sorting
  const locations = filterMeta.locations
  const experience = Number(filterMeta.experience)
  const postType = filterMeta.type
  const keywords = filterMeta.keywords

  return searchPost({
    keywords,
    numberOfDataPerPage: NUMBER_OF_DATE_PER_FETCH,
    experience,
    industries,
    locations,
    page: pageParam,
    type: postType,
    sortingType,
  })
}

interface ISearchPostProps {
  locationList: TLocationData[]
  industryList: IIndustryResponse[]
}

interface State {
  keywords: string
  debouncedKeywords: string
  locations: string[]
  location: string
  industries: Set<string>
  experience: number
  debouncedExperience: number
  sorting: string
  postType: EPostType
  params: URLSearchParams
}

type Action =
  | { type: "SET_KEYWORDS"; payload: string }
  | { type: "SET_DEBOUNCED_KEYWORDS"; payload: string }
  | { type: "SET_LOCATION"; payload: string }
  | { type: "SET_LOCATIONS"; payload: string[] }
  | { type: "SET_INDUSTRIES"; payload: Set<string> }
  | { type: "SET_EXPERIENCE"; payload: number }
  | { type: "SET_DEBOUNCED_EXPERIENCE"; payload: number }
  | { type: "SET_SORTING"; payload: string }
  | { type: "SET_POST_TYPE"; payload: EPostType }
  | { type: "SET_PARAMS"; payload: URLSearchParams }
  | { type: "RESET"; payload: State }

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_KEYWORDS":
      return { ...state, keywords: action.payload }
    case "SET_DEBOUNCED_KEYWORDS":
      return { ...state, debouncedKeywords: action.payload }
    case "SET_LOCATION":
      return { ...state, location: action.payload }
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
    case "SET_POST_TYPE":
      return { ...state, postType: action.payload }
    case "SET_PARAMS":
      return { ...state, params: action.payload }
    case "RESET":
      return action.payload
    default:
      return state
  }
}

const useSearchPost = (props: ISearchPostProps) => {
  const { locationList: locationData, industryList: industryData } = props
  const { data: postSortingOptions } = usePostSortOptions()

  const keyString = EQueryKeyString.SEARCH_POST

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const initialPostTypes = searchParams.get("types") as EPostType

  const initialState: State = {
    keywords: searchParams.get("keywords")?.toString() || "",
    debouncedKeywords: searchParams.get("keywords")?.toString() || "",
    locations: findRelatedLocationsHelper(
      locationData,
      searchParams.get("location")?.toString()
    ),
    location: searchParams?.get("location") || "all",
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
      searchParams.get("sorting")?.toString() || postSortingOptions[0].value,
    postType: initialPostTypes || EPostType.ALL,
    params: new URLSearchParams(searchParams.toString()),
  }

  const [state, dispatch] = useReducer(reducer, initialState)

  const debouncedKeywords = useDebounce(state.keywords, 1000)
  const debouncedExperience = useDebounce(state.experience, 1000)

  const createQueryStrings = useCallback(
    (entries: { name: string; value: string }[]) => {
      const newParams = new URLSearchParams(state.params.toString())

      entries.forEach(({ name, value }) => {
        newParams.set(name, value)
      })

      dispatch({ type: "SET_PARAMS", payload: newParams })
      return newParams.toString()
    },
    [state.params]
  )

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

  const removeQueryStrings = useCallback(
    (names: string[]) => {
      const newParams = new URLSearchParams(state.params.toString())

      names.forEach((name) => newParams.delete(name))

      dispatch({ type: "SET_PARAMS", payload: newParams })
      return newParams.toString()
    },
    [state.params]
  )

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

  useEffect(() => {
    router.push(`${pathname}?${state.params.toString()}`)
  }, [state.params, router, pathname])

  const handleKeywordsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const words = e.target.value
    dispatch({ type: "SET_KEYWORDS", payload: words })
  }

  const handlePostTypesChange = (type: EPostType) => {
    dispatch({ type: "SET_POST_TYPE", payload: type })
    if (type === EPostType.ALL) {
      removeQueryString("types")
    } else {
      createQueryString("types", type)
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
    const resetState: State = {
      ...initialState,
      sorting: postSortingOptions[0].value,
      params: new URLSearchParams(),
      postType: EPostType.ALL,
      locations: [],
      location: "all",
      industries: new Set(industryData.map((data) => data.uuid)),
      keywords: "",
      debouncedKeywords: "",
      experience: 0,
      debouncedExperience: 0,
    }
    dispatch({ type: "RESET", payload: resetState })
    router.push(pathname)
  }

  const filterMeta: IPostFilterMeta = {
    keywords: state.debouncedKeywords,
    locations: state.locations,
    industries: Array.from(state.industries),
    sorting: state.sorting,
    experience: state.debouncedExperience,
    type: state.postType,
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
    handlePostTypesChange,
    postType: state.postType,
    handleLocationChange,
    location: state.location,
    industries: state.industries,
    handleExperienceChange,
    experience: state.experience,
    debouncedExperience: state.debouncedExperience,
  }
}

export default useSearchPost
