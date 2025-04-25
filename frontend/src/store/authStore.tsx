import { create } from "zustand";

export interface UserState {
  user: string | null;
  token: string | null;
  setUser: (user: string | null) => void;
  setToken: (token: string | null) => void;
  clearUser: () => void;
}

export const useAuthStore = create<UserState>((set) => ({
  user: null,
  token: null,
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  clearUser: () => set({ user: null, token: null }),
}));
