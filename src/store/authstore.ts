import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types/User";

type AuthState = {
  token: string | null;
  user: User | null;
  permissions: Record<string, { read: boolean, write: boolean }> | null;
  setAuth: (payload: { token: string; user: User, permissions: any }) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      permissions: null,

      setAuth: (payload) =>
        set({
          token: payload.token,
          user: payload.user,
          permissions: payload.permissions ?? null
        }),

      clearAuth: () =>
        set({
          token: null,
          user: null,
          permissions: null
        }),
    }),
    {
      name: "auth-storage",
    }
  )
);
