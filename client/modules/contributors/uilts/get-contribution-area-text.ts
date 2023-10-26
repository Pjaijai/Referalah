import { ContributedArea } from "@/modules/contributors/types/contributed-area"

const getContributionAreaText = (area: ContributedArea) => {
  const mapper: Record<ContributedArea, string> = {
    software_development: "軟件開發",
    uiux_design: "UX/UI設計",
    marketing: "市場推廣",
    graphic_design: "平面設計",
    administration: "行政工作",
  }

  const text = mapper[area]

  return text
}

export default getContributionAreaText
