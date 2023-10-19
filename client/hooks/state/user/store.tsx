import { create } from "zustand"

interface IUserState {
  username: null | string
  isSignIn: boolean
  uuid: null | string
  photoUrl: string | null
  setUser: ({
    username,
    uuid,
    photoUrl,
  }: {
    username: string | null
    uuid: string
    photoUrl: string | null
  }) => void
  reSetUser: () => void
}
const useUserStore = create<IUserState>((set) => ({
  username: null,
  isSignIn: false,
  uuid: null,
  photoUrl: null,
  reSetUser: () => {
    set(() => ({
      username: null,
      isSignIn: false,
      uuid: null,
      photoUrl: null,
    }))
  },
  setUser: ({ username, uuid, photoUrl }) =>
    set(() => ({
      username,
      isSignIn: true,
      uuid,
      photoUrl,
    })),
}))

export default useUserStore
