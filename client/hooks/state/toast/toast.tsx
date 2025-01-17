import { create } from "zustand"

type Toast = {
  type: "changeLocale"
  value: any
}

type ToastStore = {
  toasts: Toast[]
  addToast: (toast: Toast) => void
  removeToast: (type: Toast) => void
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) =>
    set((state) => ({
      toasts: [...state.toasts, toast],
    })),
  removeToast: (type) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast !== type),
    })),
}))
