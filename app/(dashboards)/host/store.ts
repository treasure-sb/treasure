import { create } from "zustand";
import { EventDisplayData } from "@/types/event";

type Store = {
  currentPage: string;
  event: EventDisplayData | null;
  setCurrentPage: (page: string) => void;
  setEvent: (event: EventDisplayData | null) => void;
};

export const useStore = create<Store>((set) => ({
  currentPage: "dashboard",
  event: null,
  setCurrentPage: (page: string) => {
    set((state) => ({
      ...state,
      currentPage: page,
    }));
  },
  setEvent: (event: EventDisplayData | null) => {
    set((state) => ({
      ...state,
      event: event,
    }));
  },
}));
