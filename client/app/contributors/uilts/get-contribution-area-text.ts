import { ContributedArea } from "@/app/contributors/types/ contributed-area"

const getContributionAreaText = (area: ContributedArea) => {
  const mapper: Record<ContributedArea, string> = {
    software_development: "軟件開發",
    uiux_design: "UX/UI設計",
    marketing: "市場推廣",
  }

  const text = mapper[area]

  return text
}

export default getContributionAreaText
