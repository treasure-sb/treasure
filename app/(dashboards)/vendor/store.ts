import { create } from "zustand";

type Store = {
  currentPage: string | null;
  setCurrentPage: (page: string) => void;
};

export const useStore = create<Store>((set) => ({
  currentPage: "dashboard",
  setCurrentPage: (page: string) => {
    set((state) => ({
      ...state,
      currentPage: page,
    }));
  },
}));
