import { TLocationData } from "@/types/api/response/location"

const findRelatedLocationsHelper = (
  locations: TLocationData[],
  locationValue?: string
): string[] => {
  // Step 1: Find the location with the given uuid
  const targetLocation = locations.find((loc) => loc.value === locationValue)

  if (!targetLocation) return [] // If location not found, return empty array
  const locationUuid = targetLocation.uuid
  const relatedUuids: string[] = []

  // Step 2: Handle based on the location's level
  if (targetLocation.level === 1) {
    // Include the Level 1 location's uuid
    relatedUuids.push(locationUuid)

    // Find all Level 2 locations where parent_uuid matches the Level 1 uuid
    const level2Locations = locations.filter(
      (loc) => loc.level === 2 && loc.parent_uuid === locationUuid
    )
    relatedUuids.push(...level2Locations.map((loc) => loc.uuid))

    // Find all Level 3 locations where country_uuid matches the Level 1 uuid
    const level3Locations = locations.filter(
      (loc) => loc.level === 3 && loc.country_uuid === locationUuid
    )
    relatedUuids.push(...level3Locations.map((loc) => loc.uuid))
  } else if (targetLocation.level === 2) {
    // Include the Level 2 location's uuid
    relatedUuids.push(locationUuid)

    // Find all Level 3 locations where parent_uuid matches the Level 2 uuid
    const level3Locations = locations.filter(
      (loc) => loc.level === 3 && loc.parent_uuid === locationUuid
    )
    relatedUuids.push(...level3Locations.map((loc) => loc.uuid))
  } else if (targetLocation.level === 3) {
    // For Level 3, return only its own uuid
    relatedUuids.push(locationUuid)
  }

  return relatedUuids
}

export default findRelatedLocationsHelper
