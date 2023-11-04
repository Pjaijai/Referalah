import { Separator } from "@/components/ui/separator"
import IndustryDisplay from "@/components/customized-ui/info-display/industry"
import LocationDisplay from "@/components/customized-ui/info-display/location"
import YearsOfExperienceDisplay from "@/components/customized-ui/info-display/years-of-experience"

interface PostDetailsInfoDisplayProps {
  city: string | null
  province: string | null
  country: string | null
  industry: string | null
  yearOfExperience: number | null
}

const PostDetailsInfoDisplay = ({
  city,
  province,
  country,
  industry,
  yearOfExperience,
}: PostDetailsInfoDisplayProps) => {
  return (
    <div className="my-3">
      <Separator />
      <div className="my-4 text-sm">
        {(city || province || country) && (
          <LocationDisplay
            city={city}
            province={province}
            country={country}
            className="xs:max-w-full mb-2 max-w-sm"
          />
        )}
        {industry && (
          <IndustryDisplay
            industry={industry}
            className="xs:max-w-full mb-2 max-w-xs"
          />
        )}
        {yearOfExperience !== null && (
          <YearsOfExperienceDisplay
            yearOfExperience={yearOfExperience}
            className="xs:max-w-full  max-w-xs"
          />
        )}
      </div>
      <Separator />
    </div>
  )
}

export default PostDetailsInfoDisplay
