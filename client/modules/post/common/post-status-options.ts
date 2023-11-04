import { PostStatus } from "@/types/common/post-status"
import { ISelectOption } from "@/components/customized-ui/selects/base"

const postStatusOptions: ISelectOption[] = [
  { title: "開放", value: PostStatus.ACTIVE },
  { title: "已關閉", value: PostStatus.INACTIVE },
]

export { postStatusOptions }
