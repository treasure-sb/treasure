import { create } from "zustand";
import validateUser from "@/lib/actions/auth";
import { createClient } from "@/utils/supabase/client";

interface AuthStore {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => {
  const checkUser = async () => {
    const supabase = createClient();
    const user = await supabase.auth.getUser();
    if (user) {
      return true;
    }
    return false;
  };

  const validate = async () => {
    const user = await checkUser();
    if (user) {
      set({ isLoggedIn: true });
    }
  };

  validate();

  return {
    isLoggedIn: false,
    login: () => set({ isLoggedIn: true }),
    logout: () => set({ isLoggedIn: false }),
  };
});
