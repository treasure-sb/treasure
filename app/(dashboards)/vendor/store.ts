import { create } from "zustand";
import { User } from "@supabase/supabase-js";
import { usePathname } from "next/navigation";

type Store = {
  user: User | null;
  currentPage: string;
  setUser: (user: User | null) => void;
  setCurrentPage: (page: string) => void;
};

export const useStore = create<Store>((set) => ({
  user: null,
  currentPage: "dashboard",
  setUser: (user: User | null) =>
    set((state) => ({
      ...state,
      user: user,
    })),
  setCurrentPage: (page: string) => {
    set((state) => ({
      ...state,
      currentPage: page,
    }));
  },
}));
