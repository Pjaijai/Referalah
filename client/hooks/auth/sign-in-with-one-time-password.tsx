import { signInWithOneTimePassword } from "@/utils/common/api"
import { useMutation } from "@tanstack/react-query"

const useSignInWithOneTimePassword = () => {
  return useMutation({
    mutationFn: signInWithOneTimePassword,
  })
}

export default useSignInWithOneTimePassword
