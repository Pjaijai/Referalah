"use client"

import { create } from "zustand"

interface IUserState {
  username: null | string
  isSignIn: boolean
  uuid: null | string
  photoUrl: string | null
  hasConversationUnseen: boolean
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
}
const useUserStore = create<IUserState>((set) => ({
  username: null,
  isSignIn: false,
  uuid: null,
  photoUrl: null,
  hasConversationUnseen: false,
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
}))

export default useUserStore
