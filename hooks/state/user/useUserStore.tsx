import { create } from "zustand"

interface IUserState {
  email: null | string
  username: null | string
  isSignIn: boolean
  uuid: null | string
  setUser: ({
    email,
    username,
    uuid,
  }: {
    email: string
    username: string
    uuid: string
  }) => void
  reSetUser: () => void
}
const useUserStore = create<IUserState>((set) => ({
  email: null,
  username: null,
  isSignIn: false,
  uuid: null,
  reSetUser: () => {
    set(() => ({
      email: null,
      username: null,
      isSignIn: false,
      uuid: null,
    }))
  },
  setUser: ({ email, username, uuid }) =>
    set(() => ({
      email,
      username,
      isSignIn: true,
      uuid,
    })),
}))

export default useUserStore
