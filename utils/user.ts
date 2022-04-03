import { useRecoilValue } from "recoil";
import { userState } from "../context/user";

export const useIsAdmin = () => {
  const user = useRecoilValue(userState);
  return !!user?.id;
};
