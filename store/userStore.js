import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserStore = create(
    persist(
        (set) => ({
            user: null,

            setUser: (userData) => set({ user: userData }),
            setToken: (token) => set({ token }),

            clearUser: () => set({ user: null, token: null }),

        }),
        {
            name: "user-storage"
        }
    )
);
