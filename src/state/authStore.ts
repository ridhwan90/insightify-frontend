import { create } from 'zustand'

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  picture: string
}

interface AuthStore {
  user: User | null
  setUser: (user: User | null) => void
  clearUser: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}))