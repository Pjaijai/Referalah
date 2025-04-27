"use client"

import { create } from "zustand"

import { EFireType } from "@/types/common/enums/fire-type"
import { EUserStatus } from "@/types/common/user-status"

export type TFiresRecord = {
  type: EFireType
  uuid: string
  isOptimistic?: boolean
}
interface IUserState {
  username: null | string
  isSignIn: boolean
  uuid: null | string
  photoUrl: string | null
  hasConversationUnseen: boolean
  status: EUserStatus | null
  fireRecords: TFiresRecord[]
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
  setFires: (firesRecord: TFiresRecord[]) => void
  addFire: (firesRecord: TFiresRecord) => void
}
const useUserStore = create<IUserState>((set) => ({
  username: null,
  isSignIn: false,
  uuid: null,
  photoUrl: null,
  hasConversationUnseen: false,
  fireRecords: [],
  status: null,

  reSetUser: () => {
    set(() => ({
      username: null,
      isSignIn: false,
      uuid: null,
      photoUrl: null,
      status: null,
      fireRecord: [],
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
  setFires: (firesRecord: TFiresRecord[]) => {
    set((state) => ({
      ...state,
      fireRecords: firesRecord,
    }))
  },

  addFire: (firesRecord: TFiresRecord) => {
    set((state) => ({
      ...state,
      fireRecords: [...state.fireRecords, firesRecord],
    }))
  },
}))

export default useUserStore
