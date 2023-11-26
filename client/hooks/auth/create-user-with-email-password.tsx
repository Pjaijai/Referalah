import { createUserWithEmailPassword } from "@/utils/common/api"
import { useMutation } from "@tanstack/react-query"

const useCreateUserWithEmailPassword = () => {
  return useMutation({
    mutationFn: createUserWithEmailPassword,
  })
}

export default useCreateUserWithEmailPassword
