import React, { ReactChild } from "react";
import { useRecoilValue } from "recoil";
import { userState } from "../context/user";
import { LoginForm } from "./LoginForm";
import { Nav } from "./Nav";

type Props = {
  children?: ReactChild | ReactChild[];
  needsAuth: boolean;
};

export const Layout = ({ children, needsAuth = false }: Props) => {
  const user = useRecoilValue(userState);

  const handleAuth = (children?: ReactChild | ReactChild[]) => {
    console.log({ user });
    if (!needsAuth || user?.id) {
      return children;
    } else {
      return <LoginForm />;
    }
  };
  return (
    <div>
      <Nav />
      {handleAuth(children)}
    </div>
  );
};
