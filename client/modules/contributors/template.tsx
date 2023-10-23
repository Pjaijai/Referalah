import ContributorCard from "@/app/contributors/components/contributor-card"
import { IContributor } from "@/app/contributors/types/contributor"

const contributors: IContributor[] = [
  {
    name: "Paul Wong (aka R1R69)",
    links: {
      github: "https://github.com/Pjaijai",
      linkedin: "https://www.linkedin.com/in/paulwong169/",
    },
    contributedArea: ["software_development", "uiux_design"],
  },
]
const ContributorsPageTemplate = () => {
  return (
    <>
      {contributors.map((contributor) => (
        <ContributorCard
          contributedArea={contributor.contributedArea}
          links={contributor.links}
          name={contributor.name}
        />
      ))}
    </>
  )
}

export default ContributorsPageTemplate
