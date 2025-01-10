"use client"

import { create } from "zustand"

import { EUserStatus } from "@/types/common/user-status"

interface IUserState {
  username: null | string
  isSignIn: boolean
  uuid: null | string
  photoUrl: string | null
  hasConversationUnseen: boolean
  status: EUserStatus | null
  setUser: ({
    username,
    uuid,
    photoUrl,
  }: {
    username: string | null
    uuid: string
    photoUrl: string | null
    status: EUserStatus | null
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
  status: null,
  reSetUser: () => {
    set(() => ({
      username: null,
      isSignIn: false,
      uuid: null,
      photoUrl: null,
      status: null,
    }))
  },
  setUser: ({ username, uuid, photoUrl, status }) =>
    set(() => ({
      username,
      isSignIn: true,
      uuid,
      photoUrl,
      status,
      hasConversationUnseen: false,
    })),

  setConversationSeen: (hasUnseen) =>
    set((state) => ({
      ...state,
      hasConversationUnseen: hasUnseen,
    })),
}))

export default useUserStore
