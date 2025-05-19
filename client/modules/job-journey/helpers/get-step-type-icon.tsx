import { EStepType } from "@/types/common/enums/step-type"
import { Icons } from "@/components/icons"

const getStepTypeIcon = (type: EStepType | "apply"): React.ReactNode => {
  switch (type) {
    case EStepType.INTERVIEW:
      return <Icons.users width={16} height={16} />
    case EStepType.TAKE_HOME_CHALLENGE:
      return <Icons.pencil width={16} height={16} />
    case EStepType.OFFER:
      return <Icons.thumbsUp width={16} height={16} />
    case EStepType.REJECTED:
      return <Icons.cross width={16} height={16} />
    case EStepType.WITHDRAWN:
      return <Icons.cross width={16} height={16} />

    case "apply":
      return <Icons.send width={16} height={16} />
    default:
      return <Icons.circleHelp width={16} height={16} />
  }
}

export default getStepTypeIcon
