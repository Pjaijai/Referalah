import { createFire } from "@/utils/common/api"
import { useMutation } from "@tanstack/react-query"

import { TCreateFireRequest, TFireData } from "@/types/api/fire"

export const useCreateFire = () => {
  return useMutation<TFireData, Error, TCreateFireRequest>({
    mutationFn: createFire,
  })
}
