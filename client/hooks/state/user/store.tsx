"use client"

import { supabase } from "@/utils/services/supabase/config"
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
  status: EUserStatus | null
  description: string | null
  hasLinkedInVerification: boolean
  fireRecords: TFiresRecord[]
  setUser: ({
    username,
    uuid,
    photoUrl,
    status,
    description,
    hasLinkedInVerification,
  }: {
    username: string | null
    uuid: string
    photoUrl: string | null
    status: EUserStatus | null
    description: string | null
    hasLinkedInVerification: boolean
  }) => void
  reSetUser: () => void
  setFires: (firesRecord: TFiresRecord[]) => void
  addFire: (firesRecord: TFiresRecord) => void
}
const useUserStore = create<IUserState>((set, get) => ({
  username: null,
  isSignIn: false,
  uuid: null,
  photoUrl: null,
  fireRecords: [],
  status: null,
  description: null,
  hasLinkedInVerification: false,

  reSetUser: () => {
    set(() => ({
      username: null,
      isSignIn: false,
      uuid: null,
      photoUrl: null,
      status: null,
      description: null,
      hasLinkedInVerification: false,
      fireRecord: [],
    }))
  },
  setUser: ({
    username,
    uuid,
    photoUrl,
    status,
    description,
    hasLinkedInVerification,
  }) =>
    set(() => ({
      username,
      isSignIn: true,
      uuid,
      photoUrl,
      status,
      description,
      hasLinkedInVerification,
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
