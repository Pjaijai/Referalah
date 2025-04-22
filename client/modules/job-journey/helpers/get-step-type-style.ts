import { EStepType } from "@/types/common/enums/step-type"

const getStepTypeStyle = (type: EStepType): string => {
  switch (type) {
    case EStepType.INTERVIEW:
    case EStepType.TAKE_HOME_CHALLENGE:
      return "text-indigo-600 bg-indigo-50"
    case EStepType.OFFER:
      return "text-emerald-600 bg-emerald-50"
    case EStepType.REJECTED:
    case EStepType.WITHDRAWN:
    default:
      return "text-slate-600 bg-slate-100"
  }
}

export default getStepTypeStyle
