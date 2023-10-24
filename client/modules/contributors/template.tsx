import ContributorCard from "@/modules/contributors/components/contributor-card"
import contributors from "@/modules/contributors/data/contributors"

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
