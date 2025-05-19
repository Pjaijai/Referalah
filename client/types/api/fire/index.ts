import { EFireType } from "@/types/common/enums/fire-type"

export type TFireData = {
  id: number
  type: EFireType
  ref_uuid: string
  created_by: string
}

export type TCreateFireRequest = {
  type: EFireType
  refUuid: string
}
