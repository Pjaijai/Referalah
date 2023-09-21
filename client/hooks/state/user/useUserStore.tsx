import { create } from "zustand"

interface IUserState {
  email: null | string
  username: null | string
  isSignIn: boolean
  uuid: null | string
  photoUrl: string | null
  setUser: ({
    email,
    username,
    uuid,
    photoUrl,
  }: {
    email: string
    username: string
    uuid: string
    photoUrl: string | null
  }) => void
  reSetUser: () => void
}
const useUserStore = create<IUserState>((set) => ({
  email: null,
  username: null,
  isSignIn: false,
  uuid: null,
  photoUrl: null,
  reSetUser: () => {
    set(() => ({
      email: null,
      username: null,
      isSignIn: false,
      uuid: null,
      photoUrl: null,
    }))
  },
  setUser: ({ email, username, uuid, photoUrl }) =>
    set(() => ({
      email,
      username,
      isSignIn: true,
      uuid,
      photoUrl,
    })),
}))

export default useUserStore
