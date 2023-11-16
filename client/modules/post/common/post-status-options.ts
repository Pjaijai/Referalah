import { EPostStatus } from "@/types/common/post-status"
import { ISelectOption } from "@/components/customized-ui/selects/base"

const postStatusOptions: ISelectOption[] = [
  { title: "開放", value: EPostStatus.ACTIVE },
  { title: "關閉", value: EPostStatus.INACTIVE },
]

export { postStatusOptions }
