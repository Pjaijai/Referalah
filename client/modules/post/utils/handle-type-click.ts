import { IPostTypeSectionProps } from "@/modules/post/components/bars/search"
import { isTypeExitsInCurrentTypes } from "@/modules/post/utils/is-type-exits-in-current-types"

import { EReferralType } from "@/types/common/referral-type"

interface handleClickParam extends IPostTypeSectionProps {
  targetType: EReferralType
}
const handleTypeClick = (props: handleClickParam) => {
  const { currentTypes, setTypes, targetType } = props
  if (
    isTypeExitsInCurrentTypes(currentTypes, targetType) === true &&
    currentTypes.length > 1
  ) {
    const newTypes = currentTypes.filter((v) => v !== targetType)
    setTypes(newTypes)
  } else if (isTypeExitsInCurrentTypes(currentTypes, targetType) === false) {
    setTypes([...currentTypes, targetType])
  }
}

export { handleTypeClick }
