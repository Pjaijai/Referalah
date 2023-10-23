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
  {
    name: "Gabby Chan",
    links: {
      linkedin: "https://www.linkedin.com/in/gabby-chan-94720b179/",
    },
    contributedArea: ["marketing"],
  },
]
const ContributorsPageTemplate = () => {
  return (
    <>
      <div className="flex flex-col gap-8">
        {contributors.map((contributor, index) => (
          <ContributorCard
            contributedArea={contributor.contributedArea}
            links={contributor.links}
            name={contributor.name}
            key={index}
          />
        ))}
      </div>
    </>
  )
}

export default ContributorsPageTemplate
