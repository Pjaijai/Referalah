import { signInWithMagicLink } from "@/utils/common/api"
import { useMutation } from "@tanstack/react-query"

const useSignInWithMagicLink = () => {
  return useMutation({
    mutationFn: signInWithMagicLink,
  })
}

export default useSignInWithMagicLink
