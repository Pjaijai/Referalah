import { useMemo } from "react"

import { TLocationData } from "@/types/api/response/location"
import { ELocale } from "@/types/common/enums/locale"
import { ISelectOption } from "@/components/customized-ui/selects/base"

const useLocationOptionsList = (
  locations: TLocationData[],
  showAllOption: boolean = false,
  locale: ELocale,
  searchTerm: string = ""
) => {
  return useMemo<ISelectOption[]>(() => {
    // Step 1: Create a Map for quick lookup of locations by uuid
    const locationMap = new Map<string, TLocationData>()
    locations.forEach((location) => locationMap.set(location.uuid, location))

    // Helper function to get the name based on locale
    const getName = (location: TLocationData): string =>
      locale === ELocale.ZH_HK ? location.cantonese_name : location.english_name

    // Helper function to get the hierarchical label
    const getLocationLabel = (location: TLocationData): string => {
      const parts: string[] = []

      // Add emoji if present for Level 1 and Level 2
      if (
        (location.level === 1 || location.level === 2) &&
        location.meta_data?.emoji
      ) {
        parts.push(location.meta_data.emoji)
      }

      // Add current location name
      parts.push(getName(location))

      // If level 1 or no parent, return now
      if (location.level === 1 || !location.parent_uuid) {
        return parts.join(" ")
      }

      // Add parent name if parent exists
      const parent = locationMap.get(location.parent_uuid)
      if (parent) {
        parts.push(getName(parent))

        // For level 3, also try to add country if it exists and is different from parent
        if (
          location.level === 3 &&
          location.country_uuid &&
          location.country_uuid !== location.parent_uuid
        ) {
          const country = locationMap.get(location.country_uuid)
          if (country && country.uuid !== parent.uuid) {
            parts.push(getName(country))
          }
        }
      } else if (location.country_uuid) {
        // If parent not found but country exists, add country
        const country = locationMap.get(location.country_uuid)
        if (country) {
          parts.push(getName(country))
        }
      }

      return parts.join(", ")
    }

    // Step 2: Filter locations based on searchTerm
    const filteredLocations = locations.filter((location) => {
      if (!searchTerm) return true
      const searchLower = searchTerm.toLowerCase()
      return (
        location.english_name.toLowerCase().includes(searchLower) ||
        location.cantonese_name.toLowerCase().includes(searchLower)
      )
    })

    // Step 3: Group filtered locations by level
    const locationsByLevel = new Map<number, TLocationData[]>()
    filteredLocations.forEach((location) => {
      if (!locationsByLevel.has(location.level)) {
        locationsByLevel.set(location.level, [])
      }
      locationsByLevel.get(location.level)!.push(location)
    })

    // Step 4: Separate Level 2 and Level 3 into those with and without parent_uuid
    const level2WithParent: TLocationData[] = []
    const level2WithoutParent: TLocationData[] = []
    const level3WithParent: TLocationData[] = []
    const level3WithoutParent: TLocationData[] = []

    ;(locationsByLevel.get(2) || []).forEach((location) => {
      if (location.parent_uuid) {
        level2WithParent.push(location)
      } else {
        level2WithoutParent.push(location)
      }
    })
    ;(locationsByLevel.get(3) || []).forEach((location) => {
      if (location.parent_uuid) {
        level3WithParent.push(location)
      } else {
        level3WithoutParent.push(location)
      }
    })

    // Sort each group alphabetically based on the name field being displayed
    const sortByName = (a: TLocationData, b: TLocationData) =>
      getName(a).localeCompare(getName(b))

    level2WithParent.sort(sortByName)
    level2WithoutParent.sort(sortByName)
    level3WithParent.sort(sortByName)
    level3WithoutParent.sort(sortByName)

    // Step 5: Create options starting with hierarchical locations
    const options: ISelectOption[] = []

    // Helper function to process a location and its children
    const processLocation = (location: TLocationData, level: number) => {
      options.push({
        value: location.uuid,
        label: getLocationLabel(location),
      })

      // Process children (next level)
      const childLevel = level + 1
      const childLocations =
        childLevel === 2
          ? level2WithParent.filter((loc) => loc.parent_uuid === location.uuid)
          : level3WithParent.filter((loc) => loc.parent_uuid === location.uuid)
      childLocations.sort(sortByName)

      childLocations.forEach((child) => {
        options.push({
          value: child.uuid,
          label: getLocationLabel(child),
        })

        // If this child is Level 2, process its Level 3 children
        if (childLevel === 2) {
          const level3Locations = level3WithParent.filter(
            (loc) => loc.parent_uuid === child.uuid
          )
          level3Locations.sort(sortByName)

          level3Locations.forEach((grandchild) => {
            options.push({
              value: grandchild.uuid,
              label: getLocationLabel(grandchild),
            })
          })
        }
      })
    }

    // Process Level 1 locations (hierarchical)
    const level1Locations = locationsByLevel.get(1) || []
    level1Locations.sort(sortByName)

    level1Locations.forEach((location) => {
      processLocation(location, 1)
    })

    // Process Level 2 with parent_uuid that weren't processed as children of Level 1
    level2WithParent.forEach((location) => {
      if (!options.some((opt) => opt.value === location.uuid)) {
        // Add level 2 location
        options.push({
          value: location.uuid,
          label: getLocationLabel(location),
        })

        // Add its level 3 children
        const level3Children = level3WithParent.filter(
          (loc) => loc.parent_uuid === location.uuid
        )
        level3Children.sort(sortByName)

        level3Children.forEach((child) => {
          options.push({
            value: child.uuid,
            label: getLocationLabel(child),
          })
        })
      }
    })

    // Process Level 3 with parent_uuid that weren't processed as children of Level 2
    // BUT skip those whose parent is in level2WithoutParent (they'll be added with their parent)
    level3WithParent.forEach((location) => {
      if (!options.some((opt) => opt.value === location.uuid)) {
        // Check if parent is in level2WithoutParent
        const parentIsOrphan = level2WithoutParent.some(
          (l2) => l2.uuid === location.parent_uuid
        )

        // Only add if parent is not an orphan (without parent)
        if (!parentIsOrphan) {
          options.push({
            value: location.uuid,
            label: getLocationLabel(location),
          })
        }
      }
    })

    // Step 6: Process Level 2 without parent_uuid and their Level 3 children
    level2WithoutParent.forEach((location) => {
      options.push({
        value: location.uuid,
        label: getLocationLabel(location),
      })

      // Add level 3 children that belong to this level 2 location
      const level3Children = level3WithParent.filter(
        (loc) => loc.parent_uuid === location.uuid
      )
      level3Children.sort(sortByName)

      level3Children.forEach((child) => {
        // Only add if not already in options
        if (!options.some((opt) => opt.value === child.uuid)) {
          options.push({
            value: child.uuid,
            label: getLocationLabel(child),
          })
        }
      })
    })

    // Process Level 3 without parent_uuid last
    level3WithoutParent.forEach((location) => {
      options.push({
        value: location.uuid,
        label: getLocationLabel(location),
      })
    })

    // Step 7: Add "All" option if specified
    if (options.length > 0 && showAllOption) {
      options.unshift({ value: "all", label: "All | 全部" })
    }

    return options
  }, [locations, locale, searchTerm, showAllOption])
}

export default useLocationOptionsList
