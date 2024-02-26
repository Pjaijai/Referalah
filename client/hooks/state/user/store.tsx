import { create } from "zustand"

interface IUserState {
  username: null | string
  isSignIn: boolean
  uuid: null | string
  photoUrl: string | null
  hasConversationUnseen: boolean
  isDonationDialogOpen: boolean
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
  setConversationSeen: (hasUnseen: boolean) => void
  setIsDonationDialogOpen: (isOpen: boolean) => void
}
const useUserStore = create<IUserState>((set) => ({
  username: null,
  isSignIn: false,
  uuid: null,
  photoUrl: null,
  hasConversationUnseen: false,
  isDonationDialogOpen: false,
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
      hasConversationUnseen: false,
    })),

  setConversationSeen: (hasUnseen) =>
    set((state) => ({
      ...state,
      hasConversationUnseen: hasUnseen,
    })),
  setIsDonationDialogOpen: (isOpen: boolean) =>
    set((state) => ({
      ...state,
      isDonationDialogOpen: isOpen,
    })),
}))

export default useUserStore
