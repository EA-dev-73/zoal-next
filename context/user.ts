import { User } from "@supabase/supabase-js";
import { atom } from "recoil";

const getUserStateDefaultValue = () => {
  if (typeof window !== "undefined") {
    const localStorageState = localStorage.getItem("supabase.auth.token");
    if (!localStorageState) return null;
    const parsed = JSON.parse(localStorageState);
    if (!parsed?.currentSession?.user) return null;
    return parsed.currentSession.user;
  } else return null;
};

export const userState = atom<User | null>({
  key: "userState", // unique ID (with respect to other atoms/selectors)
  default: getUserStateDefaultValue(), // default value (aka initial value)
});
