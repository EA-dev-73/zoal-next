import { User } from "@supabase/supabase-js";
import { atom } from "recoil";

export const userState = atom<User | null>({
  key: "userState", // unique ID (with respect to other atoms/selectors)
  default: null, // default value (aka initial value)
});
