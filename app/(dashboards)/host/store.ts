import { create } from "zustand";
import { Tables } from "@/types/supabase";
import { EventDisplayData } from "@/types/event";

type Store = {
  currentPage: string;
  currentEvent: EventDisplayData | null;
  setCurrentPage: (page: string) => void;
  setCurrentEvent: (event: EventDisplayData) => void;
};

export const useStore = create<Store>((set) => ({
  currentPage: "dashboard",
  currentEvent: null,
  setCurrentPage: (page: string) => {
    set((state) => ({
      ...state,
      currentPage: page,
    }));
  },
  setCurrentEvent: (event: EventDisplayData) => {
    set((state) => ({
      ...state,
      currentEvent: event,
    }));
  },
}));
