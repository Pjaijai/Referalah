import { CardDescription } from "@/components/ui/card"
import IndustryDisplay from "@/components/customized-ui/info-display/industry"
import LocationDisplay from "@/components/customized-ui/info-display/location"
import RequestCountDisplay from "@/components/customized-ui/info-display/requestion-count"
import YearsOfExperienceDisplay from "@/components/customized-ui/info-display/years-of-experience"

interface PostCardInfoDisplayProps {
  city: string | null
  province: string | null
  country: string | null
  industry?: string | null
  yearOfExperience?: number | null
  requestCount: number
}

// TODO remove this
const PostCardInfoDisplay = ({
  city,
  province,
  country,
  industry,
  yearOfExperience,
  requestCount,
}: PostCardInfoDisplayProps) => {
  return (
    <CardDescription className="text-overflow-ellipsis flex basis-full flex-col items-center justify-start gap-4 sm:basis-3/4">
      {(city || province || country) && (
        <LocationDisplay
          city={city}
          province={province}
          country={country}
          className="xs:max-w-full max-w-sm"
        />
      )}
      {industry && (
        <IndustryDisplay
          industry={industry}
          className="xs:max-w-full max-w-xs"
        />
      )}
      {typeof yearOfExperience === "number" && (
        <YearsOfExperienceDisplay
          yearOfExperience={yearOfExperience}
          className="xs:max-w-full max-w-xs"
        />
      )}
      {typeof requestCount === "number" && requestCount > 0 && (
        <RequestCountDisplay
          count={requestCount}
          className="xs:max-w-full max-w-xs"
        />
      )}
    </CardDescription>
  )
}

export default PostCardInfoDisplay
