import { useMemo } from "react"
import { useCurrentLocale } from "@/utils/services/internationalization/client"

import { TLocationData } from "@/types/api/response/location"
import { ELocale } from "@/types/common/enums/locale"

interface LocationLabelProps {
  location: Pick<TLocationData, "english_name" | "cantonese_name" | "uuid">
  locationList: TLocationData[]
}

const useLocationLabel = ({ location, locationList }: LocationLabelProps) => {
  const locale = useCurrentLocale()
  const locationLabel = useMemo(() => {
    // Step 1: Find the full location data in locationList
    const fullLocation = locationList.find((loc) => loc.uuid === location.uuid)
    const locationName =
      locale === ELocale.ZH_HK
        ? fullLocation?.cantonese_name ?? location.cantonese_name
        : fullLocation?.english_name ?? location.english_name

    // Step 2: Find parent and country
    let parentName = ""
    let countryName = ""
    let emoji = fullLocation?.meta_data?.emoji ?? null

    if (fullLocation && fullLocation.level !== 1) {
      // Find parent
      if (fullLocation.parent_uuid) {
        const parent = locationList.find(
          (loc) => loc.uuid === fullLocation.parent_uuid
        )
        parentName =
          locale === ELocale.ZH_HK
            ? parent?.cantonese_name ?? ""
            : parent?.english_name ?? ""
      }

      // Find country and fallback emoji
      if (fullLocation.country_uuid) {
        const country = locationList.find(
          (loc) => loc.uuid === fullLocation.country_uuid
        )
        countryName =
          locale === ELocale.ZH_HK
            ? country?.cantonese_name ?? ""
            : country?.english_name ?? ""
        if (!emoji && country?.meta_data?.emoji) {
          emoji = country.meta_data.emoji
        }

        // If parent and country are the same, omit country
        if (fullLocation.parent_uuid === fullLocation.country_uuid) {
          countryName = ""
        }
      }
    }

    // Step 3: Construct the label
    const parts: string[] = []

    // Add emoji (if exists) directly before the location name
    const locationPart = emoji ? `${emoji} ${locationName}` : locationName
    parts.push(locationPart)

    // Add parent name (if exists)
    if (parentName) parts.push(parentName)

    // Add country name (if exists and not the same as parent)
    if (countryName) parts.push(countryName)

    return parts.join(", ")
  }, [location, locationList, locale]) // Added locale to dependencies

  return locationLabel
}

export default useLocationLabel
