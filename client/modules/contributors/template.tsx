import ContributorCard from "@/modules/contributors/components/contributor-card"
import contributors from "@/modules/contributors/data/contributors"

const ContributorsPageTemplate = () => {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 p-2 md:grid-cols-3">
        {contributors.map((contributor) => (
          <ContributorCard
            contributedArea={contributor.contributedArea}
            links={contributor.links}
            name={contributor.name}
            key={contributor.name}
          />
        ))}
      </div>
    </>
  )
}

export default ContributorsPageTemplate
